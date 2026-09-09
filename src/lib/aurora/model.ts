export type Layer = {
  id: string;
  color: string;
  opacity: number;
  blur: number;
  size: number;
  x: number;
  y: number;
};

export type LayerDraft = Omit<Layer, "id">;

export type VisualLayer = Layer & {
  visX: number;
  visY: number;
  visSize: number;
  visBlur: number;
  visOpacity: number;
};

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(hex: string): string | null {
  let h = hex.trim().replace("#", "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (/^[0-9a-fA-F]{6}$/.test(h)) return `#${h.toUpperCase()}`;
  return null;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = normalizeHex(hex) ?? "#FFFFFF";
  return {
    r: Number.parseInt(n.slice(1, 3), 16),
    g: Number.parseInt(n.slice(3, 5), 16),
    b: Number.parseInt(n.slice(5, 7), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const s =
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp(s * 255, 0, 255);
}

export function mixHex(colors: string[], weights: number[]): string {
  let r = 0;
  let g = 0;
  let b = 0;
  let w = 0;
  colors.forEach((c, i) => {
    const wt = weights[i] ?? 0;
    const rgb = hexToRgb(c);
    r += srgbToLinear(rgb.r) * wt;
    g += srgbToLinear(rgb.g) * wt;
    b += srgbToLinear(rgb.b) * wt;
    w += wt;
  });
  if (w <= 0) return "#000000";
  return rgbToHex(
    linearToSrgb(r / w),
    linearToSrgb(g / w),
    linearToSrgb(b / w),
  );
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
  );
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + 6) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

export function hsvToHex(h: number, s: number, v: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 1);
  const val = clamp(v, 0, 1);
  const c = val * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

export function visualize(layer: Layer, mix: number): VisualLayer {
  const t = clamp(mix, 0, 1);
  const cx = 50;
  const cy = 26;
  return {
    ...layer,
    visX: layer.x + (cx - layer.x) * t * 0.7,
    visY: layer.y + (cy - layer.y) * t * 0.55,
    visSize: layer.size * (0.88 + t * 0.42),
    visBlur: layer.blur * (0.7 + t * 0.55),
    visOpacity: layer.opacity * (0.58 + t * 0.42),
  };
}

export function mixedHex(layers: Layer[], mix: number): string {
  const vis = layers.map((layer) => visualize(layer, mix));
  const weights = vis.map((layer) => layer.visOpacity * (layer.visSize / 100));
  const equal = 1 / Math.max(vis.length, 1);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const blended = weights.map((w) => {
    const n = w / sum;
    return n * (1 - mix) + equal * mix;
  });
  return mixHex(
    vis.map((layer) => layer.color),
    blended,
  );
}

export function withIds(layers: LayerDraft[]): Layer[] {
  return layers.map((layer, i) => ({ ...layer, id: `l${i + 1}` }));
}

export function isLayer(value: unknown): value is Layer {
  if (!value || typeof value !== "object") return false;
  const layer = value as Layer;
  return (
    typeof layer.id === "string" &&
    typeof layer.color === "string" &&
    typeof layer.opacity === "number" &&
    typeof layer.blur === "number" &&
    typeof layer.size === "number" &&
    typeof layer.x === "number" &&
    typeof layer.y === "number"
  );
}
