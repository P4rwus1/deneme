import { useEffect, useRef } from "react";
import gsap from "gsap";
import { NightSky } from "./NightSky";

export function FinalScene() {
  const moonRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && moonRef.current) {
          gsap.to(moonRef.current, {
            scale: 1.25,
            duration: 3,
            ease: "power2.out",
            filter: "brightness(1.4)",
          });
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 final-scene">
      <NightSky starCount={120} fireflyCount={24} />

      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-10">
        <div ref={moonRef} className="moon" />
      </div>

      <div className="relative z-10 max-w-2xl px-6 text-center mt-32">
        <p className="font-display text-3xl md:text-5xl leading-snug text-glow">
          Ve bir daha seçmem gerekseydi...
          <br />
          <span className="text-primary">yine seni seçerdim.</span>
        </p>
        <p className="mt-12 text-sm tracking-[0.3em] uppercase text-muted-foreground">
          — sonsuza dek senin
        </p>
      </div>
    </section>
  );
}
