import type { LayerDraft } from "./model";

export type Preset = {
  id: string;
  name: string;
  mix: number;
  layers: LayerDraft[];
};

export const FILLER_LAYERS: LayerDraft[] = [
  { color: "#FF7AD1", opacity: 0.86, blur: 80, size: 118, x: 64, y: 36 },
  { color: "#7AA2FF", opacity: 0.84, blur: 74, size: 110, x: 34, y: 18 },
];

export const PRESETS: Preset[] = [
  {
    id: "borealis",
    name: "Borealis",
    mix: 0.68,
    layers: [
      { color: "#2EF2C6", opacity: 0.94, blur: 82, size: 136, x: 26, y: 22 },
      { color: "#4DA3FF", opacity: 0.9, blur: 90, size: 130, x: 74, y: 26 },
      { color: "#7CFF8E", opacity: 0.82, blur: 74, size: 118, x: 48, y: 40 },
      { color: "#00C2D8", opacity: 0.76, blur: 96, size: 108, x: 58, y: 14 },
    ],
  },
  {
    id: "polar",
    name: "Polar",
    mix: 0.62,
    layers: [
      { color: "#9FD6FF", opacity: 0.92, blur: 88, size: 134, x: 32, y: 20 },
      { color: "#3D5A8A", opacity: 0.88, blur: 98, size: 148, x: 70, y: 32 },
      { color: "#E8F3FF", opacity: 0.76, blur: 70, size: 102, x: 48, y: 40 },
    ],
  },
  {
    id: "ember",
    name: "Ember",
    mix: 0.7,
    layers: [
      { color: "#FF6A3D", opacity: 0.92, blur: 82, size: 132, x: 28, y: 24 },
      { color: "#FFB45A", opacity: 0.86, blur: 76, size: 118, x: 68, y: 18 },
      { color: "#FF4B73", opacity: 0.84, blur: 90, size: 124, x: 52, y: 40 },
    ],
  },
  {
    id: "glacier",
    name: "Glacier",
    mix: 0.74,
    layers: [
      { color: "#DFFFF8", opacity: 0.9, blur: 92, size: 140, x: 40, y: 18 },
      { color: "#7ED0EA", opacity: 0.88, blur: 80, size: 124, x: 72, y: 30 },
      { color: "#F2F7FF", opacity: 0.74, blur: 66, size: 98, x: 26, y: 36 },
      { color: "#5EEAD4", opacity: 0.8, blur: 84, size: 114, x: 54, y: 42 },
    ],
  },
  {
    id: "ion",
    name: "Ion",
    mix: 0.66,
    layers: [
      { color: "#5CFFE7", opacity: 0.92, blur: 78, size: 126, x: 24, y: 22 },
      { color: "#FF4F9A", opacity: 0.86, blur: 84, size: 122, x: 74, y: 20 },
      { color: "#4D6BFF", opacity: 0.84, blur: 92, size: 134, x: 50, y: 40 },
      { color: "#C6F6FF", opacity: 0.72, blur: 72, size: 102, x: 60, y: 12 },
    ],
  },
  {
    id: "moss",
    name: "Moss",
    mix: 0.6,
    layers: [
      { color: "#86EFAC", opacity: 0.92, blur: 82, size: 130, x: 30, y: 22 },
      { color: "#3F7D4E", opacity: 0.88, blur: 94, size: 142, x: 70, y: 28 },
      { color: "#C8F5A0", opacity: 0.78, blur: 70, size: 108, x: 48, y: 40 },
    ],
  },
  {
    id: "dusk",
    name: "Dusk",
    mix: 0.64,
    layers: [
      { color: "#7A8CFF", opacity: 0.9, blur: 88, size: 132, x: 28, y: 18 },
      { color: "#FFB4A2", opacity: 0.86, blur: 76, size: 118, x: 72, y: 24 },
      { color: "#C4B5FD", opacity: 0.8, blur: 82, size: 114, x: 50, y: 40 },
      { color: "#1E2A4A", opacity: 0.72, blur: 104, size: 148, x: 46, y: 32 },
    ],
  },
  {
    id: "plasma",
    name: "Plasma",
    mix: 0.72,
    layers: [
      { color: "#FF3CAC", opacity: 0.92, blur: 80, size: 126, x: 26, y: 24 },
      { color: "#2E8BFF", opacity: 0.9, blur: 86, size: 130, x: 72, y: 20 },
      { color: "#7B4DFF", opacity: 0.84, blur: 92, size: 124, x: 50, y: 40 },
    ],
  },
];
