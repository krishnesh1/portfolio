"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { coursework, education, profile } from "@/lib/data";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // words light up as you scroll through the statement
      gsap.fromTo(
        ".about-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(".about-fade", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-grid", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = profile.about.split(" ");

  return (
    <section ref={root} id="about" className="relative py-28 sm:py-40">
      <div className="container-x">
        <p className="eyebrow mb-10">( 02 ) About</p>

        <p className="about-text max-w-5xl font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
          {words.map((w, i) => (
            <span key={i} className="about-word inline-block pr-[0.28em]">
              {w}
            </span>
          ))}
        </p>

        <div className="about-grid mt-20 grid gap-6 lg:grid-cols-5">
          <div className="about-fade rounded-3xl border border-line bg-surface p-7 lg:col-span-3">
            <p className="eyebrow mb-6">Education</p>
            <ul className="divide-y divide-line">
              {education.map((e) => (
                <li key={e.school} className="flex flex-col gap-1 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{e.school}</h3>
                    <p className="mt-1 text-sm text-mute">{e.degree}</p>
                    <p className="text-sm text-mute">{e.place}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-display text-sm text-bone">{e.period}</p>
                    <p className="mt-1 text-sm text-acid">{e.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-fade rounded-3xl border border-line bg-surface p-7 lg:col-span-2">
            <p className="eyebrow mb-6">Relevant coursework</p>
            <div className="flex flex-wrap gap-2">
              {coursework.map((c) => (
                <span key={c} className="pill transition-colors hover:border-acid hover:text-acid">
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-8 text-sm text-mute">
              Based in <span className="text-bone">{profile.location}</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
