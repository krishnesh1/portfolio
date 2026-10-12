"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import { navLinks, profile } from "@/lib/data";

/**
 * Morphing floating-pill navbar.
 *  scrollY < 50 : full width, flush top, square corners, roomy padding
 *  scrollY > 50 : centered pill, detached from top, slim, glass blur + border
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  return (
    <>
      {/* The wrapper ignores pointer events so the page underneath stays clickable;
          only the <nav> itself re-enables them. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <nav
          className={[
            "pointer-events-auto flex items-center justify-between border transition-all duration-500 ease-in-out",
            scrolled
              ? "mt-4 w-[92%] max-w-4xl rounded-full border-white/10 bg-ink/60 px-5 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
              : "mt-0 w-full max-w-full rounded-none border-transparent bg-transparent px-5 py-6 sm:px-10",
          ].join(" ")}
        >
          <TransitionLink href="/" className="group flex items-center gap-2" aria-label="Home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-acid font-display text-sm font-semibold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
              KK
            </span>
            <span className="hidden font-display text-sm font-medium tracking-tight sm:block">
              {profile.firstName}
              <span className="text-mute"> {profile.lastName}</span>
            </span>
          </TransitionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <TransitionLink
                  href={l.href}
                  className="rounded-full px-4 py-2 font-display text-sm text-mute transition-colors hover:bg-white/5 hover:text-bone"
                >
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download
              className="hidden rounded-full bg-acid px-5 py-2 font-display text-sm font-medium text-ink transition-transform duration-300 hover:scale-105 sm:inline-block"
            >
              Résumé ↓
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 md:hidden"
            >
              <span className={`h-px w-4 bg-bone transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-bone transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-surface px-8 md:hidden"
          >
            <ul className="space-y-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.6 } }}
                >
                  <TransitionLink
                    href={l.href}
                    onNavigate={() => setOpen(false)}
                    className="block font-display text-5xl font-semibold tracking-tight active:text-acid"
                  >
                    {l.label}
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>
            <a href={profile.resume} download className="btn-primary mt-10 w-fit">
              Download résumé ↓
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
