"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PlayImage } from "@/data/play";

const OPEN_MS = 340;
const CLOSE_MS = 300;
const WHEEL_THROTTLE_MS = 350;
const SWIPE_PX = 40;

interface Props {
  photos: PlayImage[];
  /** Chapter title — shown in the caption and used for the accessible name. */
  label: string;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  /** Resolves the inline thumbnail for an index, so open and close can FLIP. */
  getThumb: (i: number) => HTMLElement | null;
}

const FOCUSABLE = "button:not([disabled])";

/**
 * The expanded photo viewer.
 *
 * Two things here are load-bearing rather than decorative:
 *
 * 1. It renders through a portal onto `document.body`. A fixed, z-indexed
 *    overlay *inside* the layout wrapper would put a stacking context above the
 *    hero, and a stacking context isolates blending — which would silently kill
 *    the `.knockout` mix-blend effect. As a sibling of the wrapper it cannot.
 *
 * 2. Open and close are FLIPped from the thumbnail, and close targets whatever
 *    photo you navigated to rather than the one you opened. The photo you are
 *    looking at is the one that shrinks back into the page.
 */
export default function Lightbox({
  photos,
  label,
  index,
  onIndexChange,
  onClose,
  getThumb,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wheelAt = useRef(0);
  const swipeFrom = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);

  const count = photos.length;
  const photo = photos[index];
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- page state while open ------------------------------------------ */

  useEffect(() => {
    const body = document.body;
    const app = document.getElementById("app-root");
    const restoreTo = document.activeElement as HTMLElement | null;
    const prevOverflow = body.style.overflow;

    body.style.overflow = "hidden";
    app?.setAttribute("inert", "");
    closeRef.current?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      // Order matters: focus cannot land inside a subtree that is still inert.
      app?.removeAttribute("inert");
      restoreTo?.focus?.();
    };
  }, []);

  /* ---- open FLIP ------------------------------------------------------- */

  // Runs once. `index` is intentionally not a dependency — this is the opening
  // animation, and stepping between photos must not replay it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above.
  useLayoutEffect(() => {
    const node = figureRef.current;
    const thumb = getThumb(index);
    if (!node || !thumb || reduced) return;

    const from = thumb.getBoundingClientRect();
    const to = node.getBoundingClientRect();
    if (!to.width || !to.height || !from.width) return;

    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);

    node.style.transition = "none";
    node.style.transform = `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
    void node.offsetWidth; // force the inverted state to be committed
    node.style.transition = `transform ${OPEN_MS}ms var(--ease-out)`;
    node.style.transform = "none";
  }, []);

  /* ---- close ----------------------------------------------------------- */

  const close = useCallback(() => {
    if (closing) return;
    const node = figureRef.current;
    const thumb = getThumb(index);
    const onScreen =
      thumb &&
      (() => {
        const r = thumb.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
      })();

    if (!node || !thumb || !onScreen || reduced) {
      onClose();
      return;
    }

    setClosing(true);
    const from = thumb.getBoundingClientRect();
    const to = node.getBoundingClientRect();
    node.style.transition = `transform ${CLOSE_MS}ms var(--ease-in-out), opacity ${CLOSE_MS}ms var(--ease-in-out)`;
    node.style.transform = `translate(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${
      from.top + from.height / 2 - (to.top + to.height / 2)
    }px) scale(${from.width / to.width}, ${from.height / to.height})`;
    window.setTimeout(onClose, CLOSE_MS);
  }, [closing, index, getThumb, onClose, reduced]);

  const step = useCallback(
    (delta: number) => onIndexChange((((index + delta) % count) + count) % count),
    [index, count, onIndexChange],
  );

  /* ---- keyboard -------------------------------------------------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (count > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        step(e.key === "ArrowLeft" ? -1 : 1);
        return;
      }
      if (e.key !== "Tab") return;

      // Focus must not escape into the (inert, but belt-and-braces) page.
      const nodes = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, step, count]);

  if (typeof document === "undefined") return null;

  return createPortal(
    // The keyboard equivalents of every pointer action here — Escape to close,
    // arrows to step — are bound on `document` in the effect above, because they
    // have to work wherever focus sits inside the dialog. A local `onKeyDown`
    // would only fire while this exact element had focus, which it never does.
    // biome-ignore lint/a11y/useKeyWithClickEvents: handled on document
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} photo viewer`}
      className="fixed inset-0 z-[300] grid cursor-zoom-out px-4 py-16 sm:px-16"
      style={{ opacity: closing ? 0 : 1, transition: `opacity ${CLOSE_MS}ms linear` }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (!figureRef.current?.contains(t) && !t.closest("button")) close();
      }}
      onWheel={(e) => {
        if (count < 2) return;
        const now = Date.now();
        if (now - wheelAt.current < WHEEL_THROTTLE_MS) return;
        wheelAt.current = now;
        step(e.deltaY > 0 ? 1 : -1);
      }}
      onPointerDown={(e) => {
        swipeFrom.current = e.pointerType === "touch" ? e.clientX : null;
      }}
      onPointerUp={(e) => {
        const from = swipeFrom.current;
        swipeFrom.current = null;
        if (from === null || count < 2) return;
        const dx = e.clientX - from;
        if (Math.abs(dx) >= SWIPE_PX) step(dx < 0 ? 1 : -1);
      }}
    >
      <div
        ref={scrimRef}
        className="lightbox-scrim backdrop-blur-[32px] backdrop-saturate-180"
        aria-hidden="true"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label="Close (Esc)"
        className="glass-2 sq-full absolute top-4 right-4 z-10 grid h-12 w-12 place-items-center transition-transform duration-200 hover:scale-105"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          <path
            d="M3 3 L17 17 M17 3 L3 17"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous (left arrow)"
            className="absolute top-1/2 left-1 z-10 h-20 w-12 -translate-y-1/2 text-slate transition-colors hover:text-ink sm:left-3"
          >
            <svg viewBox="0 0 20 56" aria-hidden="true" className="mx-auto h-11 w-4">
              <path
                d="M16 3 L4 28 L16 53"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next (right arrow)"
            className="absolute top-1/2 right-1 z-10 h-20 w-12 -translate-y-1/2 text-slate transition-colors hover:text-ink sm:right-3"
          >
            <svg viewBox="0 0 20 56" aria-hidden="true" className="mx-auto h-11 w-4">
              <path
                d="M4 3 L16 28 L4 53"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </>
      )}

      {/* `relative` so it paints above the fixed scrim, which is a positioned
          sibling earlier in the DOM. */}
      <figure ref={figureRef} className="relative m-0 cursor-default place-self-center">
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="lightbox-swap sq block max-h-[72vh] w-auto max-w-full object-contain shadow-[0_30px_70px_-30px_rgb(15_27_46/0.42)]"
        />
        <figcaption className="mt-4 text-center">
          <span className="t-title block">{label}</span>
          {photo.caption && <span className="t-small mt-1 block">{photo.caption}</span>}
          <span className="t-small tabular mt-1 block">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
