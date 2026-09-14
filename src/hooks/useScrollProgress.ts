"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-driven state shared by the hero and the nav.
 *
 * The hero's name liquifies while the nav wordmark fills from the bottom, and
 * those two have to stay in step — they are one gesture read twice. Rather than
 * each component inventing its own ramp, both derive from the single progress
 * value here.
 *
 * A hook rather than context: both consumers are already client components, and
 * a second passive scroll listener costs less than a provider re-rendering the
 * page on every scroll tick.
 */

/**
 * Live `prefers-reduced-motion`. Read as a media query rather than baked into
 * CSS because the values it gates are computed in JS.
 *
 * Starts `false` so the server and the first client render agree; the effect
 * corrects it before paint matters.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Hero scroll progress, clamped to 0 → 1 across the first 80% of a viewport
 * height. Every derived ramp in Hero and Nav is a function of this.
 *
 * Held at 0 under reduced motion, which resolves the whole liquify sequence to
 * its resting state. Consumers that would become *invisible* at 0 — the nav
 * wordmark is the one — must check `usePrefersReducedMotion` themselves rather
 * than treating 0 as "not scrolled yet".
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setProgress(0);
      return;
    }

    // Tracked in a local rather than read back off state: the listener closes
    // over its render's `progress`, so comparing against state would compare
    // every scroll event to a stale value and fire a setState on each one.
    let last = -1;

    const onScroll = () => {
      const next = Math.max(
        0,
        Math.min(1, window.scrollY / (window.innerHeight * 0.8)),
      );
      // A threshold, not a throttle. Without it this re-renders the hero and
      // the nav on every scrolled pixel; 0.004 is roughly one render per two
      // pixels of a 900px viewport, which is below what the eye resolves on
      // any of the ramps it drives.
      if (Math.abs(next - last) > 0.004) {
        last = next;
        setProgress(next);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return progress;
}
