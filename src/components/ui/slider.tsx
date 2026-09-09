import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SliderProps = {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string;
  "aria-label"?: string;
  style?: CSSProperties;
};

function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
  style,
  ...props
}: SliderProps) {
  const [ready, setReady] = useState(false);
  const current = value[0] ?? min;
  const pct = ((current - min) / (max - min || 1)) * 100;

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={cn("slider-wrap flex h-11 w-full items-center", className)}
      style={{
        ["--slider-pct" as string]: `${pct}%`,
        ...style,
      }}
    >
      {ready ? (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onValueChange?.([next]);
          }}
          className="aurora-slider"
          {...props}
        />
      ) : (
        <div className="h-11 w-full" aria-hidden />
      )}
    </div>
  );
}

export { Slider };
