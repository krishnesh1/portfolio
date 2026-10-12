"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/lib/data";
import TransitionLink from "@/components/TransitionLink";

/* ---------- abstract UI mock-ups (pure CSS, no images needed) ---------- */

function SocietyMock() {
  const bars = [38, 62, 48, 80, 56, 92, 70];
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-white/10 bg-ink/80 p-4 text-[10px] backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs text-bone">Admin · Dashboard</span>
        <span className="rounded-full bg-acid/15 px-2 py-0.5 text-acid">JWT · secured</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Visitors", "128"],
          ["Complaints", "14"],
          ["Bills due", "32"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-surface p-3">
            <div className="text-mute">{k}</div>
            <div className="mt-1 font-display text-lg text-bone">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-2 rounded-xl border border-white/10 bg-surface p-3">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-iris/40 to-acid" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex gap-2">
        {["Visitors", "Complaints", "Billing", "Polls"].map((t) => (
          <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-mute">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExpenseMock() {
  const rows = [
    ["Aman", "Rohit", "₹ 420", true],
    ["Neha", "Aman", "₹ 180", false],
    ["Rohit", "Neha", "₹ 75", true],
  ] as const;
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-white/10 bg-ink/80 p-4 text-[10px] backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs text-bone">Settle up</span>
        <span className="rounded-full bg-iris/20 px-2 py-0.5 text-iris">real-time</span>
      </div>
      <div className="rounded-xl border border-white/10 bg-surface p-3">
        <div className="text-mute">Group total</div>
        <div className="font-display text-2xl text-bone">₹ 2,340</div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2">
        {rows.map(([a, b, amt, hot], i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-surface px-3 py-2.5">
            <span className="text-bone">
              {a} <span className="text-mute">owes</span> {b}
            </span>
            <span className={`font-display text-sm ${hot ? "text-acid" : "text-bone"}`}>{amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const mocks: Record<string, React.ReactNode> = {
  "society-management": <SocietyMock />,
  "expense-tracker": <ExpenseMock />,
};

/* ----------------------------- the cards ----------------------------- */

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <article
      className="project-card sticky overflow-hidden rounded-[2rem] border border-line bg-surface"
      style={{ top: `${5.5 + i * 1.25}rem` }}
    >
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-sm text-acid">{p.index}</span>
            <span className="eyebrow">Full-stack · MERN</span>
          </div>

          <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {p.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-mute">{p.summary}</p>

          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-bone/80">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-acid" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-9">
            <TransitionLink href={`/projects/${p.slug}`} className="btn-primary">
              Case study <span aria-hidden>→</span>
            </TransitionLink>
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn-ghost">
                Live ↗
              </a>
            )}
            {p.code && (
              <a href={p.code} target="_blank" rel="noreferrer" className="btn-ghost">
                Code ↗
              </a>
            )}
          </div>
        </div>

        <div className="project-visual relative min-h-[320px] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-iris/25 via-surface to-acid/10 p-5 sm:p-8" data-cursor>
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background-image:linear-gradient(#ffffff0d_1px,transparent_1px),linear-gradient(90deg,#ffffff0d_1px,transparent_1px)] [background-size:32px_32px]"
          />
          <div className="project-mock relative h-full will-change-transform">{mocks[p.slug]}</div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.from(".work-head > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work-head", start: "top 85%" },
      });

      // parallax on each mock-up + a gentle tilt following the pointer
      gsap.utils.toArray<HTMLElement>(".project-visual").forEach((visual) => {
        const mock = visual.querySelector(".project-mock");
        gsap.fromTo(
          mock,
          { y: 50 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        const rx = gsap.quickTo(mock, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(mock, "rotationY", { duration: 0.6, ease: "power3.out" });
        gsap.set(mock, { transformPerspective: 900 });
        visual.addEventListener("mousemove", (e) => {
          const r = visual.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        });
        visual.addEventListener("mouseleave", () => {
          rx(0);
          ry(0);
        });
      });

      // earlier cards recede as the next one stacks on top (desktop only)
      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top 20%", scrub: true },
          });
        });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="work" className="relative pb-24 pt-10 sm:pb-40">
      <div className="container-x">
        <div className="work-head mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-4">( 01 ) Selected work</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Things I&apos;ve built
            </h2>
          </div>
          <p className="max-w-sm text-sm text-mute">
            Two live full-stack applications — secure by default, designed around real users.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((p, i) => (
            <Card key={p.slug} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
