import { useMemo } from "react";

interface Props {
  starCount?: number;
  fireflyCount?: number;
  showAurora?: boolean;
}

export function NightSky({
  starCount = 80,
  fireflyCount = 14,
  showAurora = true,
}: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.8 + 0.35,
        delay: Math.random() * 6,
        opacity: 0.25 + Math.random() * 0.75,
        blur: Math.random() > 0.78 ? 1 + Math.random() * 1.5 : 0,
        depth: Math.random(),
      })),
    [starCount],
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: fireflyCount }, (_, i) => ({
        id: i,
        top: 30 + Math.random() * 60,
        left: Math.random() * 100,
        fx: (Math.random() - 0.5) * 120 + "px",
        fy: -(40 + Math.random() * 80) + "px",
        dur: 6 + Math.random() * 8 + "s",
        delay: Math.random() * 6,
      })),
    [fireflyCount],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {showAurora && (
        <>
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="aurora aurora-3" />
        </>
      )}
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            transform: `scale(${0.82 + s.depth * 0.35})`,
          }}
        />
      ))}
      {fireflies.map((f) => (
        <span
          key={`f-${f.id}`}
          className="firefly"
          style={
            {
              top: `${f.top}%`,
              left: `${f.left}%`,
              "--fx": f.fx,
              "--fy": f.fy,
              "--dur": f.dur,
              animationDelay: `${f.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
