import type Lenis from "lenis";

/** Tiny module-level store so any component can drive the smooth scroller. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

export const scrollToTarget = (target: string | number | HTMLElement, immediate = false) => {
  if (instance) {
    instance.scrollTo(target as never, { offset: 0, immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView();
  else target.scrollIntoView();
};
