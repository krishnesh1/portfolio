"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Small follower dot that grows over interactive elements ([data-cursor], a, button). */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = dot.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      gsap.to(el, { scale: t ? 3.2 : 1, duration: 0.3, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-acid opacity-0 mix-blend-difference"
    />
  );
}
