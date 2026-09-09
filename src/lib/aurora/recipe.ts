import { mixedHex, visualize, type Layer } from "./model";

function round(n: number, digits = 3) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export type RecipeInput = {
  layers: Layer[];
  mix: number;
  presetId: string | null;
};

export function buildRecipePayload({ layers, mix, presetId }: RecipeInput) {
  const mixed = mixedHex(layers, mix);
  return {
    format: "aurora-mixer-recipe",
    version: 1,
    mixedHex: mixed,
    mix: round(mix),
    mixMeaning: "0 = layers sit apart (Separate), 1 = pulled together and blended (Blend)",
    layerCount: layers.length,
    presetId,
    layers: layers.map((layer, index) => {
      const vis = visualize(layer, mix);
      return {
        index: index + 1,
        id: layer.id,
        color: layer.color,
        opacity: round(layer.opacity),
        blurPx: round(layer.blur, 1),
        sizePercent: round(layer.size, 1),
        xPercent: round(layer.x, 1),
        yPercent: round(layer.y, 1),
        live: {
          xPercent: round(vis.visX, 1),
          yPercent: round(vis.visY, 1),
          widthPercent: round(vis.visSize, 1),
          heightPercent: round(vis.visSize * 0.58, 1),
          blurPx: round(vis.visBlur, 1),
          opacity: round(vis.visOpacity),
        },
      };
    }),
    render: {
      stageBackground: "#07080c",
      stageWash: "radial-gradient(ellipse at 50% 28%, #0d1c24 0%, #07080c 72%)",
      blendMode: "plus-lighter",
      isolation: "isolate",
      ellipseHeightFromWidth: 0.58,
      transformOrigin: "translate(-50%, -50%)",
      mixAnchor: { xPercent: 50, yPercent: 26 },
      formulas: {
        visX: "x + (50 - x) * mix * 0.7",
        visY: "y + (26 - y) * mix * 0.55",
        visSize: "size * (0.88 + mix * 0.42)",
        visBlur: "blur * (0.7 + mix * 0.55)",
        visOpacity: "opacity * (0.58 + mix * 0.42)",
        mixedHex:
          "linear-sRGB mix of layer colors; weight_i = visOpacity_i * visSize_i / 100; then lerp those weights toward equal 1/n by mix",
      },
      animation: {
        name: "aurora-drift",
        durationSec: layers.map((_, i) => round(16 + i * 3.5, 1)),
        delaySec: layers.map((_, i) => round(i * -2.4, 1)),
        spinDeg: layers.map((_, i) => i * 18),
        keyframes:
          "0/100%: translate(-50%,-50%) rotate(spin) scale(1); 35%: translate(-47%,-54%) rotate(spin+10deg) scale(1.07); 65%: translate(-54%,-46%) rotate(spin-8deg) scale(0.95)",
      },
    },
  };
}

export function formatAuroraRecipe(input: RecipeInput): string {
  const data = buildRecipePayload(input);
  const lines: string[] = [
    "# Aurora Mixer recipe",
    "Reproduce this aurora 1:1. Use the JSON at the bottom as source of truth.",
    "",
    "## Result",
    `- Mixed HEX (linear-sRGB weighted): ${data.mixedHex}`,
    `- Mix / Blend: ${data.mix}  (0 = Separate, 1 = Blend)`,
    `- Layer count: ${data.layerCount}`,
    `- Preset: ${data.presetId ?? "custom (user-tuned)"}`,
    "",
    "## Source parameters (what the sliders store)",
  ];

  for (const layer of data.layers) {
    lines.push(
      "",
      `### Layer ${layer.index}`,
      `- color: ${layer.color}`,
      `- opacity: ${layer.opacity}  (range 0.15–1)`,
      `- blur: ${layer.blurPx}px  (range 24–140)`,
      `- size: ${layer.sizePercent}% of stage width  (range 55–170)`,
      `- position: x ${layer.xPercent}%, y ${layer.yPercent}%  (origin top-left of the stage)`,
      `- live ellipse after Mix: left ${layer.live.xPercent}%, top ${layer.live.yPercent}%, width ${layer.live.widthPercent}%, height ${layer.live.heightPercent}%, blur ${layer.live.blurPx}px, opacity ${layer.live.opacity}`,
    );
  }

  lines.push(
    "",
    "## How to render",
    "1. Full-viewport dark stage. Background `#07080c` with a radial wash `ellipse at 50% 28%` from `#0d1c24` to `#07080c`.",
    "2. `isolation: isolate` on the stage so `mix-blend-mode: plus-lighter` stacks as light, not mud.",
    "3. Each layer is an absolutely positioned ellipse (`border-radius: 50%`), centered with `transform: translate(-50%, -50%)`.",
    "4. Apply Mix (t in 0..1) before painting:",
    "   - visX = x + (50 - x) * t * 0.7",
    "   - visY = y + (26 - y) * t * 0.55",
    "   - visSize = size * (0.88 + t * 0.42)   → width = visSize% of stage, height = visSize * 0.58%",
    "   - visBlur = blur * (0.7 + t * 0.55) px",
    "   - visOpacity = opacity * (0.58 + t * 0.42)",
    "5. Paint with `background: color`, `opacity: visOpacity`, `filter: blur(visBlur)`, `mix-blend-mode: plus-lighter`.",
    "6. Drift animation: 16s + index*3.5s, delay index*-2.4s, CSS variable `--spin: index*18deg`. Soft organic path, not a spin.",
    "7. Overlay a dark vignette (stronger at edges) and a faint grain (`mix-blend-mode: overlay`, ~7% opacity).",
    "8. Mixed HEX: convert each layer to linear sRGB. Weight = visOpacity * visSize/100. Normalize. Lerp weights toward equal 1/n by Mix. Convert back to sRGB hex.",
    "",
    "Do not substitute `screen` or `lighten` for `plus-lighter` — the glow will look wrong.",
    "Do not skip the Mix formulas and paint source x/y/size/blur/opacity directly — the live look is the vis* values.",
    "",
    "## Machine JSON",
    "```json",
    JSON.stringify(data, null, 2),
    "```",
    "",
  );

  return lines.join("\n");
}
