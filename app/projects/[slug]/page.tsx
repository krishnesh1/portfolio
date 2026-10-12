import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/data";
import TransitionLink from "@/components/TransitionLink";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  return p ? { title: `${p.title} — Krishnesh Karn`, description: p.short } : {};
}

export default function ProjectPage({ params }: Props) {
  const idx = projects.findIndex((x) => x.slug === params.slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="relative min-h-screen overflow-hidden pb-24 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full bg-iris/20 blur-[140px]"
      />
      <div className="container-x relative">
        <TransitionLink href="/#work" className="eyebrow inline-flex items-center gap-2 hover:text-acid">
          ← All work
        </TransitionLink>

        <p className="mt-12 font-display text-sm text-acid">{p.index} / Case study</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[1] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
          {p.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mute">{p.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary">
              Live site ↗
            </a>
          )}
          {p.code && (
            <a href={p.code} target="_blank" rel="noreferrer" className="btn-ghost">
              Source code ↗
            </a>
          )}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-line bg-surface p-7 lg:col-span-2">
            <p className="eyebrow mb-6">What I built</p>
            <ul className="space-y-5">
              {p.highlights.map((h, i) => (
                <li key={h} className="flex gap-4 text-bone/85">
                  <span className="font-display text-sm text-acid">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-7">
            <p className="eyebrow mb-6">Stack</p>
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <TransitionLink
          href={`/projects/${next.slug}`}
          className="group mt-24 block border-t border-line pt-10"
        >
          <span className="eyebrow">Next project</span>
          <span className="mt-3 flex items-center justify-between font-display text-4xl font-semibold tracking-tight transition-colors group-hover:text-acid sm:text-6xl">
            {next.title}
            <span className="transition-transform duration-500 group-hover:translate-x-3">→</span>
          </span>
        </TransitionLink>
      </div>
    </article>
  );
}
