import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChevronsUp, i as ClipboardList, n as Share, o as ChevronsDown, r as Copy, s as Check } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CukKC-M9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function normalizeHex(hex) {
	let h = hex.trim().replace("#", "");
	if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split("").map((c) => c + c).join("");
	if (/^[0-9a-fA-F]{6}$/.test(h)) return `#${h.toUpperCase()}`;
	return null;
}
function hexToRgb(hex) {
	const n = normalizeHex(hex) ?? "#FFFFFF";
	return {
		r: Number.parseInt(n.slice(1, 3), 16),
		g: Number.parseInt(n.slice(3, 5), 16),
		b: Number.parseInt(n.slice(5, 7), 16)
	};
}
function rgbToHex(r, g, b) {
	const h = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}
function srgbToLinear(c) {
	const s = c / 255;
	return s <= .04045 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
}
function linearToSrgb(c) {
	return clamp((c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - .055) * 255, 0, 255);
}
function mixHex(colors, weights) {
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
	return rgbToHex(linearToSrgb(r / w), linearToSrgb(g / w), linearToSrgb(b / w));
}
function relativeLuminance(hex) {
	const { r, g, b } = hexToRgb(hex);
	return .2126 * srgbToLinear(r) + .7152 * srgbToLinear(g) + .0722 * srgbToLinear(b);
}
function hexToHsv(hex) {
	const { r, g, b } = hexToRgb(hex);
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const d = max - Math.min(rn, gn, bn);
	let h = 0;
	if (d !== 0) {
		if (max === rn) h = ((gn - bn) / d + 6) % 6;
		else if (max === gn) h = (bn - rn) / d + 2;
		else h = (rn - gn) / d + 4;
		h *= 60;
	}
	const s = max === 0 ? 0 : d / max;
	return {
		h,
		s,
		v: max
	};
}
function hsvToHex(h, s, v) {
	const hue = (h % 360 + 360) % 360;
	const sat = clamp(s, 0, 1);
	const val = clamp(v, 0, 1);
	const c = val * sat;
	const x = c * (1 - Math.abs(hue / 60 % 2 - 1));
	const m = val - c;
	let r = 0;
	let g = 0;
	let b = 0;
	if (hue < 60) [r, g, b] = [
		c,
		x,
		0
	];
	else if (hue < 120) [r, g, b] = [
		x,
		c,
		0
	];
	else if (hue < 180) [r, g, b] = [
		0,
		c,
		x
	];
	else if (hue < 240) [r, g, b] = [
		0,
		x,
		c
	];
	else if (hue < 300) [r, g, b] = [
		x,
		0,
		c
	];
	else [r, g, b] = [
		c,
		0,
		x
	];
	return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
function visualize(layer, mix) {
	const t = clamp(mix, 0, 1);
	const cx = 50;
	const cy = 26;
	return {
		...layer,
		visX: layer.x + (cx - layer.x) * t * .7,
		visY: layer.y + (cy - layer.y) * t * .55,
		visSize: layer.size * (.88 + t * .42),
		visBlur: layer.blur * (.7 + t * .55),
		visOpacity: layer.opacity * (.58 + t * .42)
	};
}
function mixedHex(layers, mix) {
	const vis = layers.map((layer) => visualize(layer, mix));
	const weights = vis.map((layer) => layer.visOpacity * (layer.visSize / 100));
	const equal = 1 / Math.max(vis.length, 1);
	const sum = weights.reduce((a, b) => a + b, 0) || 1;
	const blended = weights.map((w) => {
		return w / sum * (1 - mix) + equal * mix;
	});
	return mixHex(vis.map((layer) => layer.color), blended);
}
function withIds(layers) {
	return layers.map((layer, i) => ({
		...layer,
		id: `l${i + 1}`
	}));
}
function isLayer(value) {
	if (!value || typeof value !== "object") return false;
	const layer = value;
	return typeof layer.id === "string" && typeof layer.color === "string" && typeof layer.opacity === "number" && typeof layer.blur === "number" && typeof layer.size === "number" && typeof layer.x === "number" && typeof layer.y === "number";
}
function round(n, digits = 3) {
	const p = 10 ** digits;
	return Math.round(n * p) / p;
}
function buildRecipePayload({ layers, mix, presetId }) {
	return {
		format: "aurora-mixer-recipe",
		version: 1,
		mixedHex: mixedHex(layers, mix),
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
					heightPercent: round(vis.visSize * .58, 1),
					blurPx: round(vis.visBlur, 1),
					opacity: round(vis.visOpacity)
				}
			};
		}),
		render: {
			stageBackground: "#07080c",
			stageWash: "radial-gradient(ellipse at 50% 28%, #0d1c24 0%, #07080c 72%)",
			blendMode: "plus-lighter",
			isolation: "isolate",
			ellipseHeightFromWidth: .58,
			transformOrigin: "translate(-50%, -50%)",
			mixAnchor: {
				xPercent: 50,
				yPercent: 26
			},
			formulas: {
				visX: "x + (50 - x) * mix * 0.7",
				visY: "y + (26 - y) * mix * 0.55",
				visSize: "size * (0.88 + mix * 0.42)",
				visBlur: "blur * (0.7 + mix * 0.55)",
				visOpacity: "opacity * (0.58 + mix * 0.42)",
				mixedHex: "linear-sRGB mix of layer colors; weight_i = visOpacity_i * visSize_i / 100; then lerp those weights toward equal 1/n by mix"
			},
			animation: {
				name: "aurora-drift",
				durationSec: layers.map((_, i) => round(16 + i * 3.5, 1)),
				delaySec: layers.map((_, i) => round(i * -2.4, 1)),
				spinDeg: layers.map((_, i) => i * 18),
				keyframes: "0/100%: translate(-50%,-50%) rotate(spin) scale(1); 35%: translate(-47%,-54%) rotate(spin+10deg) scale(1.07); 65%: translate(-54%,-46%) rotate(spin-8deg) scale(0.95)"
			}
		}
	};
}
function formatAuroraRecipe(input) {
	const data = buildRecipePayload(input);
	const lines = [
		"# Aurora Mixer recipe",
		"Reproduce this aurora 1:1. Use the JSON at the bottom as source of truth.",
		"",
		"## Result",
		`- Mixed HEX (linear-sRGB weighted): ${data.mixedHex}`,
		`- Mix / Blend: ${data.mix}  (0 = Separate, 1 = Blend)`,
		`- Layer count: ${data.layerCount}`,
		`- Preset: ${data.presetId ?? "custom (user-tuned)"}`,
		"",
		"## Source parameters (what the sliders store)"
	];
	for (const layer of data.layers) lines.push("", `### Layer ${layer.index}`, `- color: ${layer.color}`, `- opacity: ${layer.opacity}  (range 0.15–1)`, `- blur: ${layer.blurPx}px  (range 24–140)`, `- size: ${layer.sizePercent}% of stage width  (range 55–170)`, `- position: x ${layer.xPercent}%, y ${layer.yPercent}%  (origin top-left of the stage)`, `- live ellipse after Mix: left ${layer.live.xPercent}%, top ${layer.live.yPercent}%, width ${layer.live.widthPercent}%, height ${layer.live.heightPercent}%, blur ${layer.live.blurPx}px, opacity ${layer.live.opacity}`);
	lines.push("", "## How to render", "1. Full-viewport dark stage. Background `#07080c` with a radial wash `ellipse at 50% 28%` from `#0d1c24` to `#07080c`.", "2. `isolation: isolate` on the stage so `mix-blend-mode: plus-lighter` stacks as light, not mud.", "3. Each layer is an absolutely positioned ellipse (`border-radius: 50%`), centered with `transform: translate(-50%, -50%)`.", "4. Apply Mix (t in 0..1) before painting:", "   - visX = x + (50 - x) * t * 0.7", "   - visY = y + (26 - y) * t * 0.55", "   - visSize = size * (0.88 + t * 0.42)   → width = visSize% of stage, height = visSize * 0.58%", "   - visBlur = blur * (0.7 + t * 0.55) px", "   - visOpacity = opacity * (0.58 + t * 0.42)", "5. Paint with `background: color`, `opacity: visOpacity`, `filter: blur(visBlur)`, `mix-blend-mode: plus-lighter`.", "6. Drift animation: 16s + index*3.5s, delay index*-2.4s, CSS variable `--spin: index*18deg`. Soft organic path, not a spin.", "7. Overlay a dark vignette (stronger at edges) and a faint grain (`mix-blend-mode: overlay`, ~7% opacity).", "8. Mixed HEX: convert each layer to linear sRGB. Weight = visOpacity * visSize/100. Normalize. Lerp weights toward equal 1/n by Mix. Convert back to sRGB hex.", "", "Do not substitute `screen` or `lighten` for `plus-lighter` — the glow will look wrong.", "Do not skip the Mix formulas and paint source x/y/size/blur/opacity directly — the live look is the vis* values.", "", "## Machine JSON", "```json", JSON.stringify(data, null, 2), "```", "");
	return lines.join("\n");
}
var FILLER_LAYERS = [{
	color: "#FF7AD1",
	opacity: .86,
	blur: 80,
	size: 118,
	x: 64,
	y: 36
}, {
	color: "#7AA2FF",
	opacity: .84,
	blur: 74,
	size: 110,
	x: 34,
	y: 18
}];
var PRESETS = [
	{
		id: "borealis",
		name: "Borealis",
		mix: .68,
		layers: [
			{
				color: "#2EF2C6",
				opacity: .94,
				blur: 82,
				size: 136,
				x: 26,
				y: 22
			},
			{
				color: "#4DA3FF",
				opacity: .9,
				blur: 90,
				size: 130,
				x: 74,
				y: 26
			},
			{
				color: "#7CFF8E",
				opacity: .82,
				blur: 74,
				size: 118,
				x: 48,
				y: 40
			},
			{
				color: "#00C2D8",
				opacity: .76,
				blur: 96,
				size: 108,
				x: 58,
				y: 14
			}
		]
	},
	{
		id: "polar",
		name: "Polar",
		mix: .62,
		layers: [
			{
				color: "#9FD6FF",
				opacity: .92,
				blur: 88,
				size: 134,
				x: 32,
				y: 20
			},
			{
				color: "#3D5A8A",
				opacity: .88,
				blur: 98,
				size: 148,
				x: 70,
				y: 32
			},
			{
				color: "#E8F3FF",
				opacity: .76,
				blur: 70,
				size: 102,
				x: 48,
				y: 40
			}
		]
	},
	{
		id: "ember",
		name: "Ember",
		mix: .7,
		layers: [
			{
				color: "#FF6A3D",
				opacity: .92,
				blur: 82,
				size: 132,
				x: 28,
				y: 24
			},
			{
				color: "#FFB45A",
				opacity: .86,
				blur: 76,
				size: 118,
				x: 68,
				y: 18
			},
			{
				color: "#FF4B73",
				opacity: .84,
				blur: 90,
				size: 124,
				x: 52,
				y: 40
			}
		]
	},
	{
		id: "glacier",
		name: "Glacier",
		mix: .74,
		layers: [
			{
				color: "#DFFFF8",
				opacity: .9,
				blur: 92,
				size: 140,
				x: 40,
				y: 18
			},
			{
				color: "#7ED0EA",
				opacity: .88,
				blur: 80,
				size: 124,
				x: 72,
				y: 30
			},
			{
				color: "#F2F7FF",
				opacity: .74,
				blur: 66,
				size: 98,
				x: 26,
				y: 36
			},
			{
				color: "#5EEAD4",
				opacity: .8,
				blur: 84,
				size: 114,
				x: 54,
				y: 42
			}
		]
	},
	{
		id: "ion",
		name: "Ion",
		mix: .66,
		layers: [
			{
				color: "#5CFFE7",
				opacity: .92,
				blur: 78,
				size: 126,
				x: 24,
				y: 22
			},
			{
				color: "#FF4F9A",
				opacity: .86,
				blur: 84,
				size: 122,
				x: 74,
				y: 20
			},
			{
				color: "#4D6BFF",
				opacity: .84,
				blur: 92,
				size: 134,
				x: 50,
				y: 40
			},
			{
				color: "#C6F6FF",
				opacity: .72,
				blur: 72,
				size: 102,
				x: 60,
				y: 12
			}
		]
	},
	{
		id: "moss",
		name: "Moss",
		mix: .6,
		layers: [
			{
				color: "#86EFAC",
				opacity: .92,
				blur: 82,
				size: 130,
				x: 30,
				y: 22
			},
			{
				color: "#3F7D4E",
				opacity: .88,
				blur: 94,
				size: 142,
				x: 70,
				y: 28
			},
			{
				color: "#C8F5A0",
				opacity: .78,
				blur: 70,
				size: 108,
				x: 48,
				y: 40
			}
		]
	},
	{
		id: "dusk",
		name: "Dusk",
		mix: .64,
		layers: [
			{
				color: "#7A8CFF",
				opacity: .9,
				blur: 88,
				size: 132,
				x: 28,
				y: 18
			},
			{
				color: "#FFB4A2",
				opacity: .86,
				blur: 76,
				size: 118,
				x: 72,
				y: 24
			},
			{
				color: "#C4B5FD",
				opacity: .8,
				blur: 82,
				size: 114,
				x: 50,
				y: 40
			},
			{
				color: "#1E2A4A",
				opacity: .72,
				blur: 104,
				size: 148,
				x: 46,
				y: 32
			}
		]
	},
	{
		id: "plasma",
		name: "Plasma",
		mix: .72,
		layers: [
			{
				color: "#FF3CAC",
				opacity: .92,
				blur: 80,
				size: 126,
				x: 26,
				y: 24
			},
			{
				color: "#2E8BFF",
				opacity: .9,
				blur: 86,
				size: 130,
				x: 72,
				y: 20
			},
			{
				color: "#7B4DFF",
				opacity: .84,
				blur: 92,
				size: 124,
				x: 50,
				y: 40
			}
		]
	}
];
var STORAGE_KEY = "aurora-mixer-v2";
var INITIAL = PRESETS[0] ?? {
	id: "borealis",
	name: "Borealis",
	mix: .68,
	layers: FILLER_LAYERS
};
var initialLayers = withIds(INITIAL.layers);
var useAuroraStore = create((set, get) => ({
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
				const data = JSON.parse(raw);
				if (Array.isArray(data.layers) && data.layers.length >= 2) {
					const layers = data.layers.filter(isLayer).slice(0, 4);
					if (layers.length >= 2) {
						const selectedId = typeof data.selectedId === "string" && layers.some((layer) => layer.id === data.selectedId) ? data.selectedId : layers[0].id;
						set({
							layers,
							mix: typeof data.mix === "number" ? clamp(data.mix, 0, 1) : get().mix,
							selectedId,
							presetId: typeof data.presetId === "string" ? data.presetId : null,
							hydrated: true
						});
						return;
					}
				}
			}
		} catch {}
		set({ hydrated: true });
	},
	setMix: (mix) => set({
		mix: clamp(mix, 0, 1),
		presetId: null
	}),
	selectLayer: (id) => set({ selectedId: id }),
	updateLayer: (id, patch) => set((state) => ({
		presetId: null,
		layers: state.layers.map((layer) => layer.id === id ? {
			...layer,
			...patch
		} : layer)
	})),
	setLayerCount: (count) => {
		const n = clamp(Math.round(count), 2, 4);
		const { layers, selectedId } = get();
		if (n === layers.length) return;
		if (n < layers.length) {
			const next = layers.slice(0, n);
			set({
				layers: next,
				selectedId: next.some((layer) => layer.id === selectedId) ? selectedId : next[0].id,
				presetId: null
			});
			return;
		}
		const extras = FILLER_LAYERS.slice(0, n - layers.length).map((layer, i) => ({
			...layer,
			id: `l${layers.length + i + 1}`
		}));
		set({
			layers: [...layers, ...extras],
			presetId: null
		});
	},
	applyPreset: (id) => {
		const preset = PRESETS.find((item) => item.id === id);
		if (!preset) return;
		const layers = withIds(preset.layers);
		set({
			layers,
			mix: preset.mix,
			selectedId: layers[0].id,
			presetId: preset.id
		});
	}
}));
if (typeof window !== "undefined") useAuroraStore.subscribe((state) => {
	if (!state.hydrated) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify({
		layers: state.layers,
		mix: state.mix,
		selectedId: state.selectedId,
		presetId: state.presetId
	}));
});
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Slider({ value, min = 0, max = 100, step = 1, onValueChange, className, style, ...props }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const current = value[0] ?? min;
	const pct = (current - min) / (max - min || 1) * 100;
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("slider-wrap flex h-11 w-full items-center", className),
		style: {
			["--slider-pct"]: `${pct}%`,
			...style
		},
		children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value: current,
			onChange: (event) => {
				const next = Number(event.target.value);
				if (Number.isFinite(next)) onValueChange?.([next]);
			},
			className: "aurora-slider",
			...props
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-11 w-full",
			"aria-hidden": true
		})
	});
}
function ColorPicker({ color, layerId, onChange }) {
	const hsv = hexToHsv(color);
	const [hueLock, setHueLock] = (0, import_react.useState)(null);
	const [hexText, setHexText] = (0, import_react.useState)(color);
	const padRef = (0, import_react.useRef)(null);
	const hue = hueLock ?? hsv.h;
	(0, import_react.useEffect)(() => {
		setHueLock(null);
		setHexText(color);
	}, [layerId]);
	(0, import_react.useEffect)(() => {
		setHexText(color);
	}, [color]);
	function commitHex(value) {
		const next = normalizeHex(value);
		if (next) onChange(next);
		else setHexText(color);
	}
	function setFromPointer(event) {
		const el = padRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const s = clamp((event.clientX - rect.left) / rect.width, 0, 1);
		const v = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
		onChange(hsvToHex(hue, s, v));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative size-11 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-0",
						style: { backgroundColor: color }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "color",
						value: normalizeHex(color) ?? "#FFFFFF",
						onChange: (event) => onChange(event.target.value.toUpperCase()),
						className: "absolute inset-0 cursor-pointer opacity-0",
						"aria-label": "Layer color"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: hexText,
					onChange: (event) => {
						const next = event.target.value.toUpperCase();
						setHexText(next);
						const parsed = normalizeHex(next);
						if (parsed) onChange(parsed);
					},
					onBlur: () => commitHex(hexText),
					onKeyDown: (event) => {
						if (event.key === "Enter") commitHex(hexText);
					},
					spellCheck: false,
					autoCapitalize: "off",
					autoCorrect: "off",
					"aria-label": "Hex color",
					className: cn("h-11 min-w-0 flex-1 rounded-lg bg-overlay px-3", "font-mono text-sm tracking-wide text-fg tabular-nums", "shadow-[var(--shadow-border)] outline-none", "focus-visible:ring-2 focus-visible:ring-accent")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: padRef,
				className: "relative h-24 touch-none overflow-hidden rounded-lg shadow-[var(--shadow-border)]",
				style: { background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))` },
				onPointerDown: (event) => {
					event.preventDefault();
					event.currentTarget.setPointerCapture(event.pointerId);
					setFromPointer(event);
				},
				onPointerMove: (event) => {
					if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
				},
				role: "slider",
				"aria-label": "Saturation and brightness",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round(hsv.s * 100),
				tabIndex: 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fg",
					style: {
						left: `${hsv.s * 100}%`,
						top: `${(1 - hsv.v) * 100}%`,
						backgroundColor: color
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				value: [hue],
				min: 0,
				max: 360,
				step: 1,
				onValueChange: ([value]) => {
					if (value === void 0) return;
					setHueLock(value);
					onChange(hsvToHex(value, hsv.s, hsv.v));
				},
				"aria-label": "Hue",
				className: "is-hue",
				style: { ["--thumb-color"]: hsvToHex(hue, 1, 1) }
			})
		]
	});
}
function PositionPad({ x, y, color, onChange }) {
	const ref = (0, import_react.useRef)(null);
	function eventToPos(event) {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		onChange(clamp((event.clientX - rect.left) / rect.width * 100, 8, 92), clamp((event.clientY - rect.top) / rect.height * 100, 12, 88));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-24 flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium tracking-wide text-muted",
			children: "Position"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "relative min-h-24 flex-1 touch-none overflow-hidden rounded-lg bg-overlay shadow-[var(--shadow-border)]",
			onPointerDown: (event) => {
				event.preventDefault();
				event.currentTarget.setPointerCapture(event.pointerId);
				eventToPos(event);
			},
			onPointerMove: (event) => {
				if (event.currentTarget.hasPointerCapture(event.pointerId)) eventToPos(event);
			},
			role: "slider",
			"aria-label": "Layer position",
			"aria-valuetext": `${Math.round(x)}%, ${Math.round(y)}%`,
			tabIndex: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fg",
				style: {
					left: `${x}%`,
					top: `${y}%`,
					backgroundColor: color
				}
			})
		})]
	});
}
function AuroraPreview({ layers, mix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aurora-stage absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: [
			layers.map((layer, index) => {
				const visual = visualize(layer, mix);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aurora-blob",
					style: {
						left: `${visual.visX}%`,
						top: `${visual.visY}%`,
						width: `${visual.visSize}%`,
						height: `${visual.visSize * .58}%`,
						backgroundColor: visual.color,
						opacity: visual.visOpacity,
						filter: `blur(${visual.visBlur}px)`,
						animationDuration: `${16 + index * 3.5}s`,
						animationDelay: `${index * -2.4}s`,
						["--spin"]: `${index * 18}deg`
					}
				}, layer.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aurora-vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aurora-grain" })
		]
	});
}
var PANELS = [
	{
		id: "adjust",
		label: "Adjust"
	},
	{
		id: "color",
		label: "Color"
	},
	{
		id: "presets",
		label: "Presets"
	}
];
function AuroraMixer() {
	const layers = useAuroraStore((s) => s.layers);
	const mix = useAuroraStore((s) => s.mix);
	const selectedId = useAuroraStore((s) => s.selectedId);
	const presetId = useAuroraStore((s) => s.presetId);
	const setMix = useAuroraStore((s) => s.setMix);
	const selectLayer = useAuroraStore((s) => s.selectLayer);
	const updateLayer = useAuroraStore((s) => s.updateLayer);
	const setLayerCount = useAuroraStore((s) => s.setLayerCount);
	const applyPreset = useAuroraStore((s) => s.applyPreset);
	const [panel, setPanel] = (0, import_react.useState)("adjust");
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [sheetReady, setSheetReady] = (0, import_react.useState)(false);
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const selected = layers.find((layer) => layer.id === selectedId) ?? layers[0];
	const hex = (0, import_react.useMemo)(() => mixedHex(layers, mix), [layers, mix]);
	const lightOnMix = relativeLuminance(hex) < .45;
	(0, import_react.useEffect)(() => {
		useAuroraStore.getState().rehydrate();
		try {
			setCollapsed(localStorage.getItem("aurora-mixer-sheet") === "collapsed");
		} catch {}
		const standaloneQuery = window.matchMedia("(display-mode: standalone)");
		const nav = window.navigator;
		setStandalone(standaloneQuery.matches || nav.standalone === true);
		setSheetReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!sheetReady) return;
		try {
			localStorage.setItem("aurora-mixer-sheet", collapsed ? "collapsed" : "open");
		} catch {}
	}, [collapsed, sheetReady]);
	async function writeClipboard(text, kind) {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(kind);
			window.setTimeout(() => setCopied(null), 1600);
		} catch {}
	}
	function copyHex() {
		writeClipboard(hex, "hex");
	}
	function copyRecipe() {
		writeClipboard(formatAuroraRecipe({
			layers,
			mix,
			presetId
		}), "recipe");
	}
	function installApp() {
		window.location.assign("/?install=1&platform=ios");
	}
	if (!selected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-dvh w-full max-w-[430px] overflow-hidden bg-bg sm:h-[min(844px,90dvh)] sm:rounded-device sm:shadow-[var(--shadow-phone)] sm:ring-1 sm:ring-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraPreview, {
				layers,
				mix
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex h-full flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "glass-bar safe-top flex items-center justify-between px-5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-muted uppercase",
							children: "Mixer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg leading-tight font-medium tracking-tight text-balance",
							children: "Aurora"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-full bg-overlay p-1",
							children: [
								2,
								3,
								4
							].map((count) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLayerCount(count),
								className: cn("h-9 min-w-11 rounded-full text-sm font-medium tabular-nums transition-colors duration-150", layers.length === count ? "bg-fg text-bg" : "text-muted"),
								"aria-pressed": layers.length === count,
								"aria-label": `${count} layers`,
								children: count
							}, count))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex flex-1 flex-col items-center justify-end px-5", collapsed ? "pb-2" : "pb-3"),
						children: collapsed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: copyHex,
							className: cn("flex items-center gap-2.5 rounded-full px-4 py-2.5", "shadow-[var(--shadow-border)] transition-transform duration-150 ease-out", "active:scale-[0.96]"),
							style: {
								backgroundColor: hex,
								color: lightOnMix ? "var(--color-fg)" : "var(--color-bg)"
							},
							"aria-label": `Mixed color ${hex}, tap to copy`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tracking-wide tabular-nums",
								children: hex
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative size-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", copied === "hex" ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: cn("size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", copied === "hex" ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none") })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: cn("glass-panel safe-bottom mx-3 mb-3 flex flex-col rounded-3xl", collapsed ? "px-4 pt-1 pb-3" : "p-4"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCollapsed((open) => !open),
									className: "flex min-h-11 min-w-0 flex-1 items-center gap-2 py-1 text-left",
									"aria-expanded": !collapsed,
									"aria-label": collapsed ? "Show mixer" : "Hide mixer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-8 shrink-0 rounded-full bg-overlay-strong" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative size-4 shrink-0 text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUp, { className: cn("absolute inset-0 size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", collapsed ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsDown, { className: cn("size-4 transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", collapsed ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none") })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-xs font-medium tracking-wide text-muted",
											children: collapsed ? "Show mixer" : "Hide mixer"
										}),
										collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto font-mono text-xs tracking-wide text-fg tabular-nums",
											children: hex
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconAction, {
									label: copied === "recipe" ? "Recipe copied" : "Copy recipe",
									onClick: copyRecipe,
									active: copied === "recipe",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" })
								}),
								standalone ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconAction, {
									label: "Install app",
									onClick: installApp,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "size-4" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("sheet-fold", collapsed && "is-collapsed"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sheet-fold-inner",
								inert: collapsed || void 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixControl, {
											mix,
											colors: layers.map((layer) => layer.color),
											mixed: hex,
											onChange: setMix
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: layers.map((layer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => selectLayer(layer.id),
												className: cn("relative size-11 rounded-full transition-[box-shadow,transform] duration-150 ease-out", "active:scale-[0.96]", selected.id === layer.id ? "shadow-[0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-fg)]" : "shadow-[var(--shadow-border)]"),
												style: { backgroundColor: layer.color },
												"aria-label": `Layer ${index + 1}`,
												"aria-pressed": selected.id === layer.id
											}, layer.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-3 rounded-full bg-overlay p-1",
											children: PANELS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setPanel(item.id),
												className: cn("h-9 rounded-full text-sm font-medium transition-colors duration-150", panel === item.id ? "bg-overlay-strong text-fg" : "text-muted"),
												"aria-pressed": panel === item.id,
												children: item.label
											}, item.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-h-44",
											children: [
												panel === "adjust" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-[1fr_6rem] items-stretch gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldSlider, {
																label: "Blur",
																value: selected.blur,
																min: 24,
																max: 140,
																format: (v) => `${Math.round(v)}`,
																onChange: (blur) => updateLayer(selected.id, { blur })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldSlider, {
																label: "Opacity",
																value: selected.opacity,
																min: .15,
																max: 1,
																step: .01,
																format: (v) => `${Math.round(v * 100)}%`,
																onChange: (opacity) => updateLayer(selected.id, { opacity })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldSlider, {
																label: "Size",
																value: selected.size,
																min: 55,
																max: 170,
																format: (v) => `${Math.round(v)}%`,
																onChange: (size) => updateLayer(selected.id, { size })
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PositionPad, {
														x: selected.x,
														y: selected.y,
														color: selected.color,
														onChange: (x, y) => updateLayer(selected.id, {
															x,
															y
														})
													})]
												}) : null,
												panel === "color" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorPicker, {
													color: selected.color,
													layerId: selected.id,
													onChange: (next) => updateLayer(selected.id, { color: next })
												}) : null,
												panel === "presets" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-4 gap-3",
													children: PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => applyPreset(preset.id),
														className: "flex flex-col gap-1.5 text-left transition-transform duration-150 ease-out active:scale-[0.96]",
														"aria-pressed": presetId === preset.id,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("relative block h-14 overflow-hidden rounded-lg bg-bg", presetId === preset.id ? "shadow-[0_0_0_1px_var(--color-fg)]" : "shadow-[var(--shadow-border)]"),
															children: preset.layers.slice(0, 3).map((layer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "absolute rounded-full",
																style: {
																	backgroundColor: layer.color,
																	width: 36 + index * 8,
																	height: 26 + index * 4,
																	left: 8 + index * 12,
																	top: 6 + index % 2 * 8,
																	filter: "blur(7px)",
																	opacity: .92,
																	mixBlendMode: "plus-lighter"
																}
															}, `${preset.id}-${index}`))
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("text-xs font-medium", presetId === preset.id ? "text-fg" : "text-muted"),
															children: preset.name
														})]
													}, preset.id))
												}) : null
											]
										})
									]
								})
							})
						})]
					})
				]
			})]
		})
	});
}
function IconAction({ label, onClick, active = false, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-label": label,
		title: label,
		className: cn("relative flex size-11 shrink-0 items-center justify-center rounded-full", "text-fg transition-transform duration-150 ease-out", "bg-overlay shadow-[var(--shadow-border)] active:scale-[0.96]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", active ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex items-center justify-center transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", active ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
			children
		})]
	});
}
function MixControl({ mix, colors, mixed, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs font-medium tracking-wide text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Separate" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-fg tabular-nums",
					children: Math.round(mix * 100)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Blend" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			value: [mix],
			min: 0,
			max: 1,
			step: .01,
			onValueChange: ([value]) => {
				if (value === void 0) return;
				onChange(value);
			},
			"aria-label": "Mix",
			className: "is-mix",
			style: {
				["--thumb-color"]: mixed,
				["--mix-track"]: `linear-gradient(90deg, ${colors.join(", ")})`
			}
		})]
	});
}
function FieldSlider({ label, value, min, max, step = 1, format, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-fg tabular-nums",
				children: format ? format(value) : value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			value: [value],
			min,
			max,
			step,
			onValueChange: ([next]) => {
				if (next === void 0) return;
				onChange(next);
			},
			"aria-label": label
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraMixer, {});
}
//#endregion
export { Home as component };
