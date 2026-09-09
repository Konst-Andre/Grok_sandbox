import { useRef, type PointerEvent } from "react";
import { clamp } from "@/lib/aurora/model";

export function PositionPad({
  x,
  y,
  color,
  onChange,
}: {
  x: number;
  y: number;
  color: string;
  onChange: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function eventToPos(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(
      clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      clamp(((event.clientY - rect.top) / rect.height) * 100, 12, 88),
    );
  }

  return (
    <div className="flex h-full min-h-24 flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-muted">Position</span>
      <div
        ref={ref}
        className="relative min-h-24 flex-1 touch-none overflow-hidden rounded-lg bg-overlay shadow-[var(--shadow-border)]"
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          eventToPos(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            eventToPos(event);
          }
        }}
        role="slider"
        aria-label="Layer position"
        aria-valuetext={`${Math.round(x)}%, ${Math.round(y)}%`}
        tabIndex={0}
      >
        <span
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fg"
          style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
