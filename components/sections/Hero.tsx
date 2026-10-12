"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { profile, stats } from "@/lib/data";
import { useReveal } from "@/lib/useReveal";
import Magnetic from "@/components/ui/Magnetic";
import TransitionLink from "@/components/TransitionLink";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const Line = ({ text, accent = false }: { text: string; accent?: boolean }) => (
  <span className="block overflow-hidden pb-[0.08em] leading-[0.92]">
    {text.split("").map((c, i) => (
      <span
        key={i}
        className={`char inline-block will-change-transform ${accent ? "text-acid" : ""}`}
        style={{ transform: "translateY(110%)" }}
      >
        {c === " " ? " " : c}
      </span>
    ))}
  </span>
);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useReveal(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "expo.out" } });
      tl.from(".hero-tag", { y: 20, opacity: 0, duration: 0.9 })
        .to(".char", { y: "0%", duration: 1.3, stagger: 0.035 }, "-=0.6")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 1 }, "-=0.9")
        .from(".hero-cta > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
        .from(".hero-stat", { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
        .from(".hero-scroll", { opacity: 0, duration: 1 }, "-=0.6");
    }, root);
    return () => ctx.revert();
  });

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-iris/20 blur-[140px]"
      />
      <HeroScene />

      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pb-24 pt-32">
        <div className="hero-tag mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 font-display text-xs uppercase tracking-[0.18em] text-mute backdrop-blur">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-acid" />
            {profile.role}
          </span>
          <span className="hidden font-display text-xs uppercase tracking-[0.18em] text-mute sm:inline">
            MERN · Java · DSA
          </span>
        </div>

        <h1 className="font-display text-[clamp(3.4rem,13vw,10.5rem)] font-semibold tracking-[-0.04em]">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden>
            <Line text={profile.firstName} />
            <Line text={profile.lastName} accent />
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
          {profile.tagline}
        </p>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <TransitionLink href="#work" className="btn-primary">
              View my work <span aria-hidden>↓</span>
            </TransitionLink>
          </Magnetic>
          <Magnetic>
            <TransitionLink href="#contact" className="btn-ghost">
              Get in touch
            </TransitionLink>
          </Magnetic>
        </div>
      </div>

      <div className="container-x relative z-10 pb-10">
        <div className="grid grid-cols-3 gap-4 border-t border-line pt-6 sm:max-w-2xl">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-[11px] leading-snug text-mute sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll absolute bottom-10 right-5 z-10 hidden items-center gap-3 font-display text-[10px] uppercase tracking-[0.3em] text-mute sm:flex lg:right-12">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollLine_2s_ease-in-out_infinite] bg-acid" />
        </span>
      </div>
      <style>{`@keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
