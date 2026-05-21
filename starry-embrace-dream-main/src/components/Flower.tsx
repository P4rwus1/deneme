import { useMemo } from "react";

interface FlowerProps {
  left: number; // %
  scale?: number;
  delay?: number;
  hue?: "pink" | "purple" | "blush";
  stemHeight?: number; // px
  bloomSize?: number; // px
}

const palettes = {
  pink: ["oklch(0.92 0.13 350)", "oklch(0.68 0.2 340)"],
  purple: ["oklch(0.78 0.15 310)", "oklch(0.55 0.22 295)"],
  blush: ["oklch(0.95 0.08 30)", "oklch(0.75 0.16 20)"],
};

export function Flower({
  left,
  scale = 1,
  delay = 0,
  hue = "pink",
  stemHeight = 80,
  bloomSize = 28,
}: FlowerProps) {
  const [p1, p2] = palettes[hue];
  const swayDur = useMemo(() => 4 + Math.random() * 3, []);
  const glow = useMemo(() => 0.45 + Math.random() * 0.55, []);

  return (
    <div
      className="flower sway"
      style={
        {
          left: `${left}%`,
          transform: `scale(${scale})`,
          "--sd": `${swayDur}s`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      <div
        className="bloom"
        data-bloom
        style={
          {
            "--bs": `${bloomSize}px`,
            "--p1": p1,
            "--p2": p2,
            "--pg": glow,
            animationDelay: `${delay}s`,
          } as React.CSSProperties
        }
      >
        {[0, 72, 144, 216, 288].map((rot) => (
          <span
            key={rot}
            className="petal"
            style={{
              transform: `rotate(${rot}deg) translateY(-25%) scale(0.7)`,
            }}
          />
        ))}
        <span className="center" />
      </div>
      <div className="stem" style={{ height: stemHeight }} />
    </div>
  );
}
