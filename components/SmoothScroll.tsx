"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";
import { REVEAL_EVENT } from "@/lib/useReveal";

/** Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // After a route transition, honour "/#hash" deep links (while still covered).
    const onReveal = () => {
      const { hash } = window.location;
      if (!hash) return;
      const el = document.querySelector(hash);
      if (el) setTimeout(() => lenis.scrollTo(el as HTMLElement, { immediate: true, force: true }), 60);
    };
    window.addEventListener(REVEAL_EVENT, onReveal);

    return () => {
      window.removeEventListener(REVEAL_EVENT, onReveal);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
