"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __revealed?: boolean;
  }
}

export const REVEAL_EVENT = "page:reveal";

/**
 * Runs `cb` once the page-transition overlay starts uncovering the page
 * (or immediately if the page is already revealed). Use it to kick off
 * entrance animations so they play *as* the black overlay slides away.
 */
export function useReveal(cb: () => void | (() => void)) {
  useEffect(() => {
    let cleanup: void | (() => void);
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      cleanup = cb();
    };
    if (window.__revealed) run();
    else window.addEventListener(REVEAL_EVENT, run, { once: true });
    return () => {
      window.removeEventListener(REVEAL_EVENT, run);
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
