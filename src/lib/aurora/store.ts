import { create } from "zustand";
import {
  clamp,
  isLayer,
  type Layer,
  type LayerDraft,
  withIds,
} from "./model";
import { FILLER_LAYERS, PRESETS } from "./presets";

const STORAGE_KEY = "aurora-mixer-v2";
const INITIAL = PRESETS[0] ?? {
  id: "borealis",
  name: "Borealis",
  mix: 0.68,
  layers: FILLER_LAYERS,
};

type AuroraState = {
  layers: Layer[];
  mix: number;
  selectedId: string;
  presetId: string | null;
  hydrated: boolean;
  rehydrate: () => void;
  setMix: (mix: number) => void;
  selectLayer: (id: string) => void;
  updateLayer: (id: string, patch: Partial<LayerDraft>) => void;
  setLayerCount: (count: number) => void;
  applyPreset: (id: string) => void;
};

const initialLayers = withIds(INITIAL.layers);

export const useAuroraStore = create<AuroraState>((set, get) => ({
  layers: initialLayers,
  mix: INITIAL.mix,
  selectedId: initialLayers[0]?.id ?? "l1",
  presetId: INITIAL.id,
  hydrated: false,

  rehydrate: () => {
    if (get().hydrated) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          layers?: unknown;
          mix?: unknown;
          selectedId?: unknown;
          presetId?: unknown;
        };
        if (Array.isArray(data.layers) && data.layers.length >= 2) {
          const layers = data.layers.filter(isLayer).slice(0, 4);
          if (layers.length >= 2) {
            const selectedId =
              typeof data.selectedId === "string" &&
              layers.some((layer) => layer.id === data.selectedId)
                ? data.selectedId
                : layers[0]!.id;
            set({
              layers,
              mix:
                typeof data.mix === "number" ? clamp(data.mix, 0, 1) : get().mix,
              selectedId,
              presetId: typeof data.presetId === "string" ? data.presetId : null,
              hydrated: true,
            });
            return;
          }
        }
      }
    } catch {
      // keep defaults
    }
    set({ hydrated: true });
  },

  setMix: (mix) => set({ mix: clamp(mix, 0, 1), presetId: null }),

  selectLayer: (id) => set({ selectedId: id }),

  updateLayer: (id, patch) =>
    set((state) => ({
      presetId: null,
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...patch } : layer,
      ),
    })),

  setLayerCount: (count) => {
    const n = clamp(Math.round(count), 2, 4);
    const { layers, selectedId } = get();
    if (n === layers.length) return;
    if (n < layers.length) {
      const next = layers.slice(0, n);
      set({
        layers: next,
        selectedId: next.some((layer) => layer.id === selectedId)
          ? selectedId
          : next[0]!.id,
        presetId: null,
      });
      return;
    }
    const extras = FILLER_LAYERS.slice(0, n - layers.length).map((layer, i) => ({
      ...layer,
      id: `l${layers.length + i + 1}`,
    }));
    set({ layers: [...layers, ...extras], presetId: null });
  },

  applyPreset: (id) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    const layers = withIds(preset.layers);
    set({
      layers,
      mix: preset.mix,
      selectedId: layers[0]!.id,
      presetId: preset.id,
    });
  },
}));

if (typeof window !== "undefined") {
  useAuroraStore.subscribe((state) => {
    if (!state.hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        layers: state.layers,
        mix: state.mix,
        selectedId: state.selectedId,
        presetId: state.presetId,
      }),
    );
  });
}
