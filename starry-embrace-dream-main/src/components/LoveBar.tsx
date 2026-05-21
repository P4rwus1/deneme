import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Props {
  onSuccess: () => void;
}

const TARGET_MIN = 72;
const TARGET_MAX = 88;
const MAX_ATTEMPTS = 3;

export function LoveBar({ onSuccess }: Props) {
  const [value, setValue] = useState(0);
  const [holding, setHolding] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("Kalbe basılı tut");
  const [done, setDone] = useState(false);

  const valueRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);

  // animate fill
  useEffect(() => {
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        height: `${value}%`,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [value]);

  useEffect(() => {
    if (!holding) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      valueRef.current = Math.min(100, valueRef.current + dt * 55);
      setValue(valueRef.current);
      if (valueRef.current >= 100) {
        // overshoot bounce back
        valueRef.current = 60;
        setValue(60);
        evaluate(60, true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding]);

  const release = () => {
    if (!holding) return;
    setHolding(false);
    evaluate(valueRef.current, false);
  };

  const evaluate = (v: number, overshot: boolean) => {
    const inZone = v >= TARGET_MIN && v <= TARGET_MAX;
    if (inZone) {
      setMessage("Mükemmel 💖");
      setDone(true);
      gsap.to(heartRef.current, {
        scale: 1.4,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        yoyo: true,
        repeat: 1,
      });
      setTimeout(() => onSuccess(), 1200);
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (overshot) setMessage("Çok fazla... daha yumuşak");
    else if (v < TARGET_MIN - 15) setMessage("Çok zayıf...");
    else setMessage("Yaklaştın...");

    // reset
    setTimeout(() => {
      valueRef.current = 0;
      setValue(0);
      if (nextAttempts >= MAX_ATTEMPTS) {
        setMessage("Son bir kez... hisset 💫");
        setAttempts(0);
      }
    }, 900);
  };

  const start = () => {
    if (done) return;
    valueRef.current = 0;
    setValue(0);
    setHolding(true);
    setMessage("Sabit tut...");
  };

  return (
    <div className="flex flex-col items-center gap-8 z-10">
      <h2 className="font-display text-3xl md:text-5xl text-glow text-center px-4">
        Beni ne kadar seviyorsun?
      </h2>

      <div className="flex items-center gap-8 md:gap-12">
        {/* Meter */}
        <div className="relative w-10 md:w-14 h-72 md:h-96 glass overflow-hidden">
          {/* target zone */}
          <div
            className="absolute left-0 right-0 border-y border-primary/60"
            style={{
              bottom: `${TARGET_MIN}%`,
              height: `${TARGET_MAX - TARGET_MIN}%`,
              background:
                "linear-gradient(to top, oklch(0.78 0.16 350 / 0.15), oklch(0.78 0.16 350 / 0.3))",
            }}
          />
          <div
            ref={fillRef}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 0,
              background:
                "linear-gradient(to top, oklch(0.55 0.22 295), oklch(0.78 0.16 350), oklch(0.9 0.12 30))",
              boxShadow: "0 0 30px oklch(0.78 0.16 350 / 0.8)",
            }}
          />
        </div>

        {/* Heart button */}
        <button
          ref={heartRef}
          onPointerDown={start}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          disabled={done}
          aria-label="Press and hold"
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-full glass shadow-glow flex items-center justify-center select-none touch-none active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-14 h-14 md:w-20 md:h-20">
            <defs>
              <radialGradient id="hg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.95 0.1 350)" />
                <stop offset="100%" stopColor="oklch(0.55 0.22 350)" />
              </radialGradient>
            </defs>
            <path
              fill="url(#hg)"
              d="M12 21s-7-4.5-9.5-9.2C.8 8.4 2.7 4.5 6.4 4.5c2 0 3.5 1.1 4.6 2.8C12.1 5.6 13.6 4.5 15.6 4.5c3.7 0 5.6 3.9 3.9 7.3C19 16.5 12 21 12 21z"
            />
          </svg>
        </button>
      </div>

      <div className="h-8 text-center">
        <p
          key={message}
          className="font-display text-xl md:text-2xl text-glow animate-[fadeIn_0.4s_ease]"
        >
          {message}
        </p>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < attempts ? "bg-muted" : "bg-primary shadow-glow"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
