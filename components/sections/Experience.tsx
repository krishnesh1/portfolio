"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Light "paper" section: two white cards on an off-white background.
 * Card 1 slides in from the left, card 2 from the right (slight delay),
 * both only once and only after entering the viewport by 100px.
 */
export default function Experience() {
  return (
    <section id="experience" className="relative rounded-[2.5rem] bg-paper py-24 text-ink sm:py-36">
      <div className="container-x">
        <p className="mb-4 font-display text-xs uppercase tracking-[0.22em] text-ink/50">( 04 ) Experience</p>
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Experience</h2>
        <p className="mt-4 max-w-xl text-base text-ink/60">
          Hands-on work shipping features, hardening backends and collaborating under real deadlines.
        </p>

        <div className="mt-14 space-y-6">
          {experience.map((e, i) => (
            <motion.article
              key={e.title}
              initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i === 0 ? 0 : 0.2, ease: EASE }}
              className="grid gap-6 rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_1px_0_rgba(8,8,11,0.04)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(8,8,11,0.25)] sm:p-9 md:grid-cols-[30%_1fr] md:gap-10"
            >
              <div>
                <h3 className="font-display text-xl font-semibold">{e.company}</h3>
                <p className="mt-1 text-sm text-ink/50">{e.meta}</p>
              </div>

              <div>
                <h4 className="font-display text-xl font-semibold">{e.title}</h4>
                <p className="mt-3 leading-relaxed text-ink/70">{e.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink/10 bg-paper px-3 py-1 text-xs font-medium text-ink/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
