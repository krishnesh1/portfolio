"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () =>
      setT(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    f();
    const id = setInterval(f, 15000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--"} IST</span>;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".contact-line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-title", start: "top 80%" },
      });
      gsap.from(".contact-fade", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-row", start: "top 90%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const socials = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "LeetCode", href: profile.leetcode },
  ].filter((s) => s.href);

  return (
    <section ref={root} id="contact" className="relative overflow-hidden pb-10 pt-28 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-acid/10 blur-[140px]"
      />
      <div className="container-x relative">
        <p className="eyebrow mb-8">( 05 ) Contact</p>

        <h2 className="contact-title font-display text-[clamp(2.8rem,10vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="contact-line block">Let&apos;s build</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="contact-line block text-acid">something great.</span>
          </span>
        </h2>

        <div className="contact-row mt-14 flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="contact-fade">
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-4 break-all rounded-full border border-line bg-surface px-7 py-5 font-display text-lg transition-colors duration-300 hover:border-acid sm:text-2xl"
              >
                {profile.email}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acid text-ink transition-transform duration-300 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>

          <div className="contact-fade flex flex-wrap gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="btn-ghost">
                {s.label} ↗
              </a>
            ))}
            <a href={profile.resume} download className="btn-primary">
              Résumé ↓
            </a>
          </div>
        </div>

        <footer className="mt-28 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-mute sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {profile.name}. Built with Next.js, Three.js &amp; GSAP.</span>
          <span className="font-display">
            {profile.location} · <Clock />
          </span>
        </footer>
      </div>
    </section>
  );
}
