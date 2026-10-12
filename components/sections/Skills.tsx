"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups } from "@/lib/data";
import Marquee from "@/components/ui/Marquee";
import SpotlightCard from "@/components/ui/SpotlightCard";

const tickerA = ["React.js", "Node.js", "Express", "MongoDB", "Tailwind", "JavaScript"];
const tickerB = ["Java", "C++", "SQL", "Docker", "AWS", "REST APIs"];

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".skill-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".skill-grid", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mb-20 -rotate-1 border-y border-line bg-surface/40 py-2">
        <Marquee items={tickerA} />
        <Marquee items={tickerB} reverse slow outline />
      </div>

      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-4">( 03 ) Toolkit</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Skills &amp; stack
            </h2>
          </div>
          <p className="max-w-sm text-sm text-mute">
            Strong foundations in Java, data structures and OOP — applied daily across the MERN stack.
          </p>
        </div>

        <div className="skill-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <div key={g.title} className="skill-card">
              <SpotlightCard className="h-full p-7">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">{g.title}</h3>
                  <span className="font-display text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line bg-ink px-3.5 py-1.5 text-sm text-bone/90 transition-colors duration-300 hover:border-acid hover:text-acid"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
