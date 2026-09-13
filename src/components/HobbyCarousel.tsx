"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PlayImage } from "@/data/play";

/** Must stay in step with `--carousel-interval` in globals.css. */
const INTERVAL_MS = 5200;

/** Below this the pointer was a click, not a drag. */
const DRAG_NOISE_PX = 8;

interface Props {
  photos: PlayImage[];
  /** The chapter title, used for the accessible name. */
  label: string;
  index: number;
  onIndexChange: (next: number, manual: boolean) => void;
  onExpand: (index: number) => void;
  /**
   * Populated with each slide's `<img>` so the lightbox can measure the
   * thumbnail it is opening from — and, because the carousel follows the
   * lightbox, the different thumbnail it closes back into.
   */
  slideRefs: React.RefObject<(HTMLImageElement | null)[]>;
}

export default function HobbyCarousel({
  photos,
  label,
  index,
  onIndexChange,
  onExpand,
  slideRefs,
}: Props) {
  const count = photos.length;
  const frameRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  /**
   * Autoplay is a courtesy, not a feature. The moment the visitor touches the
   * carousel it is theirs, permanently — nothing is more irritating than a
   * gallery that keeps moving after you have shown it where you want to be.
   */
  const [surrendered, setSurrendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reduced, setReduced] = useState(true);

  /** Announced only for changes the visitor made. Autoplay stays silent. */
  const [liveMessage, setLiveMessage] = useState("");

  /**
   * Only the current slide and its two neighbours carry a `src`. Once loaded
   * an index stays loaded, so stepping back does not re-fetch or flash.
   */
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1, count - 1]));

  useEffect(() => {
    setLoaded((prev) => {
      const next = new Set(prev);
      for (const i of [index, (index + 1) % count, (index - 1 + count) % count]) {
        next.add(i);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [index, count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Autoplay only runs while the carousel is actually being looked at.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const playing =
    count > 1 && !surrendered && !reduced && visible && !paused && !tabHidden;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => onIndexChange((index + 1) % count, false),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [playing, index, count, onIndexChange]);

  const go = useCallback(
    (next: number) => {
      const wrapped = ((next % count) + count) % count;
      setSurrendered(true);
      setLiveMessage(`${photos[wrapped].alt} — ${wrapped + 1} of ${count}`);
      onIndexChange(wrapped, true);
    },
    [count, photos, onIndexChange],
  );

  // Flick to snap. Deliberately not a finger-follow drag: at this size a
  // live-tracking track feels loose, and a flick matches how the dots behave.
  const drag = useRef<{ x: number; id: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, id: e.pointerId };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== e.pointerId) return;

    const dx = e.clientX - start.x;
    if (Math.abs(dx) <= DRAG_NOISE_PX) return;

    // A drag that ends over a photo must not also open the lightbox.
    document.addEventListener("click", (ev) => ev.stopPropagation(), {
      capture: true,
      once: true,
    });

    const width = frameRef.current?.clientWidth ?? 0;
    if (Math.abs(dx) >= Math.max(40, width * 0.08)) go(index + (dx < 0 ? 1 : -1));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  return (
    <div
      className={`${playing ? "is-playing " : ""}${surrendered ? "is-surrendered " : ""}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        drag.current = null;
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a carousel is a labelled
          group of slides, which is exactly what role=group + aria-roledescription
          describes. There is no element that carries this meaning natively. */}
      <div
        ref={frameRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label} photos`}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className="photo-lift sq-lg relative w-full touch-pan-y overflow-clip"
      >
        <div
          className="flex w-full"
          style={{
            transform: `translate3d(${-index * 100}%, 0, 0)`,
            transition: reduced
              ? "none"
              : "transform var(--duration-slow) var(--ease-out)",
          }}
        >
          {photos.map((photo, i) => (
            // biome-ignore lint/a11y/useSemanticElements: ARIA carousel pattern
            <div
              key={photo.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              // Only the visible photo is reachable — otherwise tabbing through
              // a chapter walks every hidden slide behind it.
              inert={i !== index}
              className="w-full shrink-0 grow-0"
            >
              <button
                type="button"
                onClick={() => onExpand(i)}
                aria-label={`View ${photo.alt} enlarged`}
                className="block w-full cursor-zoom-in"
              >
                <img
                  ref={(el) => {
                    slideRefs.current[i] = el;
                  }}
                  src={loaded.has(i) ? photo.src : undefined}
                  alt={photo.alt}
                  loading="lazy"
                  draggable={false}
                  className="block aspect-3/2 w-full select-none object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`${i === index ? "dot-current " : ""}grid h-11 place-items-center px-1`}
            >
              <span className="dot-mark" />
            </button>
          ))}
        </div>
      )}

      <p id={`${baseId}-live`} aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
    </div>
  );
}
