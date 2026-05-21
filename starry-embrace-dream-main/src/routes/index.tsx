import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { NightSky } from "@/components/NightSky";
import { LoveBar } from "@/components/LoveBar";
import { FlowerGarden } from "@/components/FlowerGarden";
import { LoveMessage } from "@/components/LoveMessage";
import { Gallery } from "@/components/Gallery";
import { FinalScene } from "@/components/FinalScene";



gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [started, setStarted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  const introRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);

  // LENIS
  useEffect(() => {
    let rafId = 0;
    let lenis: any;

    (async () => {
      // @ts-ignore
      const mod = await import(
        /* @vite-ignore */ "https://esm.sh/lenis@1.1.16"
      );

      const Lenis = mod.default;

      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const loop = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
    })();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy?.();
    };
  }, []);

  // INTRO ANIMATION
  useEffect(() => {
    if (!introRef.current) return;

    gsap.fromTo(
      introRef.current.querySelectorAll("[data-fade]"),
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: "power2.out",
        stagger: 0.25,
      }
    );
  }, []);

  // SES AÇ
  const startMusic = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0;

      await audioRef.current.play();

      gsap.to(audioRef.current, {
        volume: 0.3,
        duration: 2,
        ease: "power2.out",
      });

      setMuted(false);
    } catch (err) {
      console.log("Müzik başlatılamadı");
    }
  };

  // SES KAPAT / AÇ
  const toggleAudio = async () => {
    if (!audioRef.current) return;

    if (muted) {
      await audioRef.current.play();

      gsap.to(audioRef.current, {
        volume: 0.3,
        duration: 1,
      });

      setMuted(false);
    } else {
      gsap.to(audioRef.current, {
        volume: 0,
        duration: 1,
        onComplete: () => {
          audioRef.current?.pause();
        },
      });

      setMuted(true);
    }
  };

  // BAŞLAT
  const begin = async () => {
    setStarted(true);

    // MÜZİK BURADA BAŞLIYOR
    await startMusic();

    setTimeout(() => {
      gameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  };

  // LOVE BAR SUCCESS
  const onSuccess = () => {
    setUnlocked(true);

    setTimeout(() => {
      gardenRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 700);
  };

  return (
    <main className="relative atmospheric-wrap">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/ambient.mp3"
      />

      <button
        onClick={toggleAudio}
        className="fixed top-5 right-5 z-50 glass w-11 h-11 rounded-full flex items-center justify-center"
      >
        {muted ? "♪" : "✦"}
      </button>

      <section ref={introRef}>
        <NightSky starCount={160} fireflyCount={14} />

        <div
          className="absolute top-[18%] right-[12%] z-10"
          data-fade
        >
          <div className="moon" />
        </div>

        <div className="relative z-10 text-center px-6">
          <p
            data-fade
            className="text-sm tracking-[0.4em] uppercase text-muted-foreground mb-8"
          >
            Senin için
          </p>

          <h1
            data-fade
            className="font-display text-5xl md:text-7xl lg:text-8xl text-glow leading-tight"
          >
            Sana bir şey
            <br />
            <em className="text-primary">hazırladım...</em>
          </h1>

          <button
            data-fade
            onClick={begin}
            className="mt-16 glass px-8 py-4 text-sm tracking-[0.3em] uppercase"
          >
            Başlamak için dokun
          </button>
        </div>
      </section>

      {started && (
        <section ref={gameRef}>
          <NightSky starCount={90} fireflyCount={16} />

          <LoveBar onSuccess={onSuccess} />
        </section>
      )}

      {unlocked && (
        <>
          <div ref={gardenRef}>
            <FlowerGarden />
          </div>

          <LoveMessage />

          <Gallery />

          <FinalScene />
        </>
      )}
    </main>
  );
}
