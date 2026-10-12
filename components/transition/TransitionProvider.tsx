"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnimationControls } from "framer-motion";
import TransitionOverlay from "./TransitionOverlay";
import { REVEAL_EVENT } from "@/lib/useReveal";

const EASE = [0.76, 0, 0.24, 1] as const; // dramatic ease-in-out
const DURATION = 0.7;
const transition = { duration: DURATION, ease: EASE };

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pathOf = (href: string) => href.split("#")[0].split("?")[0] || "/";

/**
 * Lives in the root layout so it survives route changes.
 *
 * Flow:
 *  1. navigate(href)  → overlay slides  -100% → 0%   (covers the page)
 *  2. router.push(href) once fully covered           (content swaps behind it)
 *  3. pathname changes → overlay slides   0% → 100%  (reveals new page)
 *  4. overlay instantly resets to -100%, ready for the next click
 */
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimationControls();
  const busy = useRef(false);
  const target = useRef<string | null>(null);

  const reveal = useCallback(async () => {
    window.__revealed = true;
    window.dispatchEvent(new Event(REVEAL_EVENT));
    await controls.start({ y: "100%", transition });
    controls.set({ y: "-100%" });
  }, [controls]);

  // Intro: the overlay starts covering the screen, then slides away.
  useEffect(() => {
    window.__revealed = false;
    let cancelled = false;
    (async () => {
      await wait(900);
      if (!cancelled) await reveal();
    })();
    return () => {
      cancelled = true;
    };
  }, [reveal]);

  const navigate = useCallback(
    async (href: string) => {
      if (busy.current) return;
      if (pathOf(href) === window.location.pathname) return;
      busy.current = true;
      target.current = pathOf(href);
      window.__revealed = false;
      await controls.start({ y: "0%", transition });
      router.push(href);
    },
    [controls, router]
  );

  // New route is mounted → uncover it.
  useEffect(() => {
    if (!target.current || pathname !== target.current) return;
    let cancelled = false;
    (async () => {
      await wait(300); // let the new page settle behind the curtain
      if (cancelled) return;
      await reveal();
      busy.current = false;
      target.current = null;
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, reveal]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionCtx.Provider value={value}>
      {children}
      <TransitionOverlay controls={controls} />
    </TransitionCtx.Provider>
  );
}
