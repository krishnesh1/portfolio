"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/lenis";

/**
 * AnimLayout / PageTransition — wraps page content inside `app/template.tsx`.
 *
 * `template.tsx` re-mounts on every navigation, which makes it the right place
 * for per-page entrance behaviour. The black curtain itself lives in the
 * persistent <TransitionProvider/> (root layout) because a template that
 * unmounts cannot play an exit animation for the page that is leaving.
 *
 * Opacity only — no transforms — so `position: fixed` children keep working.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Always land at the top of a new route (while it is hidden behind the curtain).
  useEffect(() => {
    if (window.location.hash) return;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
