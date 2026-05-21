import { useEffect, useRef, useState } from "react";

const LINES = [
  "Seninle geçirdiğim her an...",
  "asla kaybetmek istemediğim bir anıya dönüştü.",
  "Sen, her uzun günün sonundaki o yumuşak ışıksın.",
];

export function LoveMessage() {
  const [shown, setShown] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const startedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          runTypewriter();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const runTypewriter = async () => {
    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i];
      for (let c = 1; c <= line.length; c++) {
        setCurrent(line.slice(0, c));
        await new Promise((r) => setTimeout(r, 52 + Math.random() * 28));
      }
      await new Promise((r) => setTimeout(r, 900));
      setShown((s) => [...s, line]);
      setCurrent("");
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  return (
    <section ref={containerRef} className="py-32">
      <div className="relative z-10 max-w-3xl px-6 text-center space-y-6">
        {shown.map((line, i) => (
          <p
            key={i}
            className="font-display text-2xl md:text-4xl leading-relaxed text-glow"
          >
            {line}
          </p>
        ))}
        {current && (
          <p className="font-display text-2xl md:text-4xl leading-relaxed text-glow">
            {current}
            <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle caret-cinematic ml-1 align-middle" />
          </p>
        )}
      </div>
    </section>
  );
}
