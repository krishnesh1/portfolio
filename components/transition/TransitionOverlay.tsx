"use client";

import { motion, type useAnimationControls } from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimationControls>;

/**
 * The black curtain. It is driven from the outside through `controls`:
 *   y: -100%  → parked above the viewport
 *   y:    0%  → covering the screen
 *   y:  100%  → slid off the bottom (then instantly reset to -100%)
 *
 * It starts at y: 0 so the very first paint is covered (no flash of
 * un-animated content before the intro reveal).
 */
export default function TransitionOverlay({ controls }: { controls: AnimationControls }) {
  return (
    <motion.div
      aria-hidden
      initial={{ y: "0%" }}
      animate={controls}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-black will-change-transform"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10">
          <span className="font-display text-3xl font-semibold tracking-tight text-bone">
            K<span className="text-acid">K</span>
          </span>
          <span className="absolute -inset-px rounded-2xl border border-acid/40 [mask-image:linear-gradient(135deg,black,transparent_60%)]" />
        </div>
        <span className="font-display text-[10px] uppercase tracking-[0.5em] text-mute">
          Krishnesh Karn
        </span>
      </div>
    </motion.div>
  );
}
