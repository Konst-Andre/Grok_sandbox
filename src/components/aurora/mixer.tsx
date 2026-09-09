import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronsDown, ChevronsUp, ClipboardList, Copy, Share } from "lucide-react";
import { mixedHex, relativeLuminance } from "@/lib/aurora/model";
import { formatAuroraRecipe } from "@/lib/aurora/recipe";
import { PRESETS } from "@/lib/aurora/presets";
import { useAuroraStore } from "@/lib/aurora/store";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ColorPicker } from "./color-picker";
import { PositionPad } from "./position-pad";
import { AuroraPreview } from "./preview";

type Panel = "adjust" | "color" | "presets";

const PANELS: { id: Panel; label: string }[] = [
  { id: "adjust", label: "Adjust" },
  { id: "color", label: "Color" },
  { id: "presets", label: "Presets" },
];

export function AuroraMixer() {
  const layers = useAuroraStore((s) => s.layers);
  const mix = useAuroraStore((s) => s.mix);
  const selectedId = useAuroraStore((s) => s.selectedId);
  const presetId = useAuroraStore((s) => s.presetId);
  const setMix = useAuroraStore((s) => s.setMix);
  const selectLayer = useAuroraStore((s) => s.selectLayer);
  const updateLayer = useAuroraStore((s) => s.updateLayer);
  const setLayerCount = useAuroraStore((s) => s.setLayerCount);
  const applyPreset = useAuroraStore((s) => s.applyPreset);

  const [panel, setPanel] = useState<Panel>("adjust");
  const [copied, setCopied] = useState<"hex" | "recipe" | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);
  const [standalone, setStandalone] = useState(false);

  const selected = layers.find((layer) => layer.id === selectedId) ?? layers[0];
  const hex = useMemo(() => mixedHex(layers, mix), [layers, mix]);
  const lightOnMix = relativeLuminance(hex) < 0.45;

  useEffect(() => {
    useAuroraStore.getState().rehydrate();
    try {
      setCollapsed(localStorage.getItem("aurora-mixer-sheet") === "collapsed");
    } catch {
      // ignore
    }
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const nav = window.navigator as Navigator & { standalone?: boolean };
    setStandalone(standaloneQuery.matches || nav.standalone === true);
    setSheetReady(true);
  }, []);

  useEffect(() => {
    if (!sheetReady) return;
    try {
      localStorage.setItem(
        "aurora-mixer-sheet",
        collapsed ? "collapsed" : "open",
      );
    } catch {
      // ignore
    }
  }, [collapsed, sheetReady]);

  async function writeClipboard(text: string, kind: "hex" | "recipe") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard may be unavailable
    }
  }

  function copyHex() {
    void writeClipboard(hex, "hex");
  }

  function copyRecipe() {
    void writeClipboard(
      formatAuroraRecipe({ layers, mix, presetId }),
      "recipe",
    );
  }

  function installApp() {
    window.location.assign("/?install=1&platform=ios");
  }

  if (!selected) return null;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg text-fg">
      <div className="relative h-dvh w-full max-w-[430px] overflow-hidden bg-bg sm:h-[min(844px,90dvh)] sm:rounded-device sm:shadow-[var(--shadow-phone)] sm:ring-1 sm:ring-border">
        <AuroraPreview layers={layers} mix={mix} />

        <div className="relative z-10 flex h-full flex-col">
          <header className="glass-bar safe-top flex items-center justify-between px-5 pb-3">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Mixer
              </p>
              <h1 className="text-lg leading-tight font-medium tracking-tight text-balance">
                Aurora
              </h1>
            </div>
            <div className="flex rounded-full bg-overlay p-1">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setLayerCount(count)}
                  className={cn(
                    "h-9 min-w-11 rounded-full text-sm font-medium tabular-nums transition-colors duration-150",
                    layers.length === count
                      ? "bg-fg text-bg"
                      : "text-muted",
                  )}
                  aria-pressed={layers.length === count}
                  aria-label={`${count} layers`}
                >
                  {count}
                </button>
              ))}
            </div>
          </header>

          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-end px-5",
              collapsed ? "pb-2" : "pb-3",
            )}
          >
            {collapsed ? null : (
            <button
              type="button"
              onClick={copyHex}
              className={cn(
                "flex items-center gap-2.5 rounded-full px-4 py-2.5",
                "shadow-[var(--shadow-border)] transition-transform duration-150 ease-out",
                "active:scale-[0.96]",
              )}
              style={{
                backgroundColor: hex,
                color: lightOnMix ? "var(--color-fg)" : "var(--color-bg)",
              }}
              aria-label={`Mixed color ${hex}, tap to copy`}
            >
              <span className="font-mono text-sm tracking-wide tabular-nums">
                {hex}
              </span>
              <span className="relative size-4">
                <Check
                  className={cn(
                    "absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                    copied === "hex"
                      ? "scale-100 opacity-100 blur-none"
                      : "scale-[0.25] opacity-0 blur-[4px]",
                  )}
                />
                <Copy
                  className={cn(
                    "size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                    copied === "hex"
                      ? "scale-[0.25] opacity-0 blur-[4px]"
                      : "scale-100 opacity-100 blur-none",
                  )}
                />
              </span>
            </button>
            )}
          </div>

          <section
            className={cn(
              "glass-panel safe-bottom mx-3 mb-3 flex flex-col rounded-3xl",
              collapsed ? "px-4 pt-1 pb-3" : "p-4",
            )}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCollapsed((open) => !open)}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-2 py-1 text-left"
                aria-expanded={!collapsed}
                aria-label={collapsed ? "Show mixer" : "Hide mixer"}
              >
                <span className="h-1 w-8 shrink-0 rounded-full bg-overlay-strong" />
                <span className="relative size-4 shrink-0 text-muted">
                  <ChevronsUp
                    className={cn(
                      "absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                      collapsed
                        ? "scale-100 opacity-100 blur-none"
                        : "scale-[0.25] opacity-0 blur-[4px]",
                    )}
                  />
                  <ChevronsDown
                    className={cn(
                      "size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                      collapsed
                        ? "scale-[0.25] opacity-0 blur-[4px]"
                        : "scale-100 opacity-100 blur-none",
                    )}
                  />
                </span>
                <span className="truncate text-xs font-medium tracking-wide text-muted">
                  {collapsed ? "Show mixer" : "Hide mixer"}
                </span>
                {collapsed ? (
                  <span className="ml-auto font-mono text-xs tracking-wide text-fg tabular-nums">
                    {hex}
                  </span>
                ) : null}
              </button>
              <IconAction
                label={copied === "recipe" ? "Recipe copied" : "Copy recipe"}
                onClick={copyRecipe}
                active={copied === "recipe"}
              >
                <ClipboardList className="size-4" />
              </IconAction>
              {standalone ? null : (
                <IconAction label="Install app" onClick={installApp}>
                  <Share className="size-4" />
                </IconAction>
              )}
            </div>

            <div className={cn("sheet-fold", collapsed && "is-collapsed")}>
              <div className="sheet-fold-inner" inert={collapsed || undefined}>
                <div className="flex flex-col gap-3 pt-2">
            <MixControl
              mix={mix}
              colors={layers.map((layer) => layer.color)}
              mixed={hex}
              onChange={setMix}
            />

            <div className="flex items-center gap-2">
              {layers.map((layer, index) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => selectLayer(layer.id)}
                  className={cn(
                    "relative size-11 rounded-full transition-[box-shadow,transform] duration-150 ease-out",
                    "active:scale-[0.96]",
                    selected.id === layer.id
                      ? "shadow-[0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-fg)]"
                      : "shadow-[var(--shadow-border)]",
                  )}
                  style={{ backgroundColor: layer.color }}
                  aria-label={`Layer ${index + 1}`}
                  aria-pressed={selected.id === layer.id}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 rounded-full bg-overlay p-1">
              {PANELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPanel(item.id)}
                  className={cn(
                    "h-9 rounded-full text-sm font-medium transition-colors duration-150",
                    panel === item.id
                      ? "bg-overlay-strong text-fg"
                      : "text-muted",
                  )}
                  aria-pressed={panel === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="min-h-44">
              {panel === "adjust" ? (
                <div className="grid grid-cols-[1fr_6rem] items-stretch gap-3">
                  <div className="flex flex-col gap-1">
                    <FieldSlider
                      label="Blur"
                      value={selected.blur}
                      min={24}
                      max={140}
                      format={(v) => `${Math.round(v)}`}
                      onChange={(blur) => updateLayer(selected.id, { blur })}
                    />
                    <FieldSlider
                      label="Opacity"
                      value={selected.opacity}
                      min={0.15}
                      max={1}
                      step={0.01}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(opacity) =>
                        updateLayer(selected.id, { opacity })
                      }
                    />
                    <FieldSlider
                      label="Size"
                      value={selected.size}
                      min={55}
                      max={170}
                      format={(v) => `${Math.round(v)}%`}
                      onChange={(size) => updateLayer(selected.id, { size })}
                    />
                  </div>
                  <PositionPad
                    x={selected.x}
                    y={selected.y}
                    color={selected.color}
                    onChange={(x, y) => updateLayer(selected.id, { x, y })}
                  />
                </div>
              ) : null}

              {panel === "color" ? (
                <ColorPicker
                  color={selected.color}
                  layerId={selected.id}
                  onChange={(next) => updateLayer(selected.id, { color: next })}
                />
              ) : null}

              {panel === "presets" ? (
                <div className="grid grid-cols-4 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className="flex flex-col gap-1.5 text-left transition-transform duration-150 ease-out active:scale-[0.96]"
                      aria-pressed={presetId === preset.id}
                    >
                      <span
                        className={cn(
                          "relative block h-14 overflow-hidden rounded-lg bg-bg",
                          presetId === preset.id
                            ? "shadow-[0_0_0_1px_var(--color-fg)]"
                            : "shadow-[var(--shadow-border)]",
                        )}
                      >
                        {preset.layers.slice(0, 3).map((layer, index) => (
                          <span
                            key={`${preset.id}-${index}`}
                            className="absolute rounded-full"
                            style={{
                              backgroundColor: layer.color,
                              width: 36 + index * 8,
                              height: 26 + index * 4,
                              left: 8 + index * 12,
                              top: 6 + (index % 2) * 8,
                              filter: "blur(7px)",
                              opacity: 0.92,
                              mixBlendMode: "plus-lighter",
                            }}
                          />
                        ))}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          presetId === preset.id ? "text-fg" : "text-muted",
                        )}
                      >
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-full",
        "text-fg transition-transform duration-150 ease-out",
        "bg-overlay shadow-[var(--shadow-border)] active:scale-[0.96]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          active ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
        )}
      >
        <Check className="size-4" />
      </span>
      <span
        className={cn(
          "flex items-center justify-center transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          active ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
        )}
      >
        {children}
      </span>
    </button>
  );
}

function MixControl({
  mix,
  colors,
  mixed,
  onChange,
}: {
  mix: number;
  colors: string[];
  mixed: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between text-xs font-medium tracking-wide text-muted">
        <span>Separate</span>
        <span className="font-mono text-fg tabular-nums">
          {Math.round(mix * 100)}
        </span>
        <span>Blend</span>
      </div>
      <Slider
        value={[mix]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={([value]) => {
          if (value === undefined) return;
          onChange(value);
        }}
        aria-label="Mix"
        className="is-mix"
        style={{
          ["--thumb-color" as string]: mixed,
          ["--mix-track" as string]: `linear-gradient(90deg, ${colors.join(", ")})`,
        }}
      />
    </div>
  );
}

function FieldSlider({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col">
      <span className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted">
          {label}
        </span>
        <span className="font-mono text-xs text-fg tabular-nums">
          {format ? format(value) : value}
        </span>
      </span>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => {
          if (next === undefined) return;
          onChange(next);
        }}
        aria-label={label}
      />
    </label>
  );
}
