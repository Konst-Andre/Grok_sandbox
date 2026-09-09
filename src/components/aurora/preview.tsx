import { visualize, type Layer } from "@/lib/aurora/model";

export function AuroraPreview({
  layers,
  mix,
}: {
  layers: Layer[];
  mix: number;
}) {
  return (
    <div className="aurora-stage absolute inset-0 overflow-hidden" aria-hidden>
      {layers.map((layer, index) => {
        const visual = visualize(layer, mix);
        return (
          <div
            key={layer.id}
            className="aurora-blob"
            style={{
              left: `${visual.visX}%`,
              top: `${visual.visY}%`,
              width: `${visual.visSize}%`,
              height: `${visual.visSize * 0.58}%`,
              backgroundColor: visual.color,
              opacity: visual.visOpacity,
              filter: `blur(${visual.visBlur}px)`,
              animationDuration: `${16 + index * 3.5}s`,
              animationDelay: `${index * -2.4}s`,
              ["--spin" as string]: `${index * 18}deg`,
            }}
          />
        );
      })}
      <div className="aurora-vignette" />
      <div className="aurora-grain" />
    </div>
  );
}
