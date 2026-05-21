import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import m1 from "@/assets/memory-1.jpg";
import m2 from "@/assets/memory-2.jpg";
import m3 from "@/assets/memory-3.jpg";
import m4 from "@/assets/memory-4.jpg";

const photos = [
  {
    src: "https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=1200",
    caption: "aurora altında bir nefes",
    rot: -6.8,
  },
  {
    src: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    caption: "ışıkların içinde ellerimiz",
    rot: 3.5,
  },
  {
    src: "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200",
    caption: "gece yürüyüşümüz",
    rot: -2.4,
  },
  {
    src: "https://images.pexels.com/photos/53265/love-couple-romantic-twilight-53265.jpeg?auto=compress&cs=tinysrgb&w=1200",
    caption: "sessizce kalbime yakın",
    rot: 7.2,
  },
];

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>("[data-polaroid]");
    cards.forEach((card, i) => {
      gsap.to(card, { y: -10, duration: 3 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4 });
      gsap.fromTo(card, { rotateY: -6, rotateX: 3 }, {
        rotateY: 6,
        rotateX: -3,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top 90%", end: "bottom top", scrub: 1.2 },
      });
    });
  }, []);

  return (
    <section className="py-24">
      <div className="relative z-10 w-full max-w-6xl px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center text-glow mb-16">
          Bizden küçük parçalar
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
        >
          {photos.map((p, i) => (
            <div
              key={i}
              data-polaroid
              className="polaroid hover:!scale-105 hover:!rotate-0"
              style={{
                transform: `rotate(${p.rot}deg)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.zIndex = "10";
              }}
            >
              <img
                className="memory-photo"
                src={p.src}
                alt={p.caption}
                loading="lazy"
                width={768}
                height={768}
              />
              <div className="caption">{p.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
