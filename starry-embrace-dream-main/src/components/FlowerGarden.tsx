import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flower } from "./Flower";
import { NightSky } from "./NightSky";

export function FlowerGarden() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const blooms = ref.current.querySelectorAll("[data-bloom]");
    const tl = gsap.timeline();
    tl.to(blooms, {
      scale: 1,
      duration: 1.4,
      ease: "elastic.out(1, 0.5)",
      stagger: { each: 0.04, from: "random" },
    });
  }, []);

  // generate field
  const flowers = Array.from({ length: 28 }, (_, i) => {
    const left = (i / 28) * 100 + (Math.random() - 0.5) * 4;
    const hues = ["pink", "purple", "blush"] as const;
    return {
      id: i,
      left,
      scale: 0.6 + Math.random() * 0.8,
      hue: hues[i % hues.length],
      stem: 60 + Math.random() * 120,
      bloom: 22 + Math.random() * 18,
      delay: Math.random() * 0.6,
    };
  });

  return (
    <section className="relative">
      <NightSky starCount={60} fireflyCount={20} />

      <div className="relative z-10 text-center px-6">
        <h2 className="font-display text-4xl md:text-6xl text-glow mb-4">
          Her şeyi sen çiçeklendirdin
        </h2>
        <p className="text-muted-foreground italic">
          Gece bile seninle daha yumuşak
        </p>
      </div>

      {/* Garden layer */}
      <div
        ref={ref}
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.1 0.04 280) 0%, transparent 80%)",
        }}
      >
        {/* back row */}
        <div className="absolute inset-x-0 bottom-0 opacity-50 blur-[1px]">
          {flowers.slice(0, 14).map((f) => (
            <Flower
              key={`b-${f.id}`}
              left={f.left}
              scale={f.scale * 0.7}
              hue={f.hue}
              stemHeight={f.stem * 0.7}
              bloomSize={f.bloom}
              delay={f.delay}
            />
          ))}
        </div>
        {/* front row */}
        <div className="absolute inset-x-0 bottom-0">
          {flowers.map((f) => (
            <Flower
              key={f.id}
              left={f.left}
              scale={f.scale}
              hue={f.hue}
              stemHeight={f.stem}
              bloomSize={f.bloom}
              delay={f.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
