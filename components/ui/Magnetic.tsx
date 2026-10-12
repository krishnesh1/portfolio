"use client";

import { useRef } from "react";
import gsap from "gsap";

/** Wrapper that gently pulls its child toward the pointer. */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
  };
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
