import { useEffect, useRef, useState, type PointerEvent } from "react";
import { clamp, hexToHsv, hsvToHex, normalizeHex } from "@/lib/aurora/model";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function ColorPicker({
  color,
  layerId,
  onChange,
}: {
  color: string;
  layerId: string;
  onChange: (hex: string) => void;
}) {
  const hsv = hexToHsv(color);
  const [hueLock, setHueLock] = useState<number | null>(null);
  const [hexText, setHexText] = useState(color);
  const padRef = useRef<HTMLDivElement>(null);
  const hue = hueLock ?? hsv.h;

  useEffect(() => {
    setHueLock(null);
    setHexText(color);
  }, [layerId]);

  useEffect(() => {
    setHexText(color);
  }, [color]);

  function commitHex(value: string) {
    const next = normalizeHex(value);
    if (next) onChange(next);
    else setHexText(color);
  }

  function setFromPointer(event: PointerEvent<HTMLDivElement>) {
    const el = padRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const v = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    onChange(hsvToHex(hue, s, v));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="relative size-11 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)]">
          <span className="absolute inset-0" style={{ backgroundColor: color }} />
          <input
            type="color"
            value={normalizeHex(color) ?? "#FFFFFF"}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Layer color"
          />
        </label>
        <input
          value={hexText}
          onChange={(event) => {
            const next = event.target.value.toUpperCase();
            setHexText(next);
            const parsed = normalizeHex(next);
            if (parsed) onChange(parsed);
          }}
          onBlur={() => commitHex(hexText)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitHex(hexText);
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Hex color"
          className={cn(
            "h-11 min-w-0 flex-1 rounded-lg bg-overlay px-3",
            "font-mono text-sm tracking-wide text-fg tabular-nums",
            "shadow-[var(--shadow-border)] outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent",
          )}
        />
      </div>

      <div
        ref={padRef}
        className="relative h-24 touch-none overflow-hidden rounded-lg shadow-[var(--shadow-border)]"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            setFromPointer(event);
          }
        }}
        role="slider"
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        tabIndex={0}
      >
        <span
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fg"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <Slider
        value={[hue]}
        min={0}
        max={360}
        step={1}
        onValueChange={([value]) => {
          if (value === undefined) return;
          setHueLock(value);
          onChange(hsvToHex(value, hsv.s, hsv.v));
        }}
        aria-label="Hue"
        className="is-hue"
        style={{ ["--thumb-color" as string]: hsvToHex(hue, 1, 1) }}
      />
    </div>
  );
}
