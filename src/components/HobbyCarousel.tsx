"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PlayImage } from "@/data/play";

/** Must stay in step with `--carousel-interval` in globals.css. */
const INTERVAL_MS = 5200;

interface Props {
  photos: PlayImage[];
  /** The chapter title, used for the accessible name. */
  label: string;
  index: number;
  onIndexChange: (next: number) => void;
  onExpand: (index: number) => void;
  /**
   * Populated with each slide's `<img>` so the lightbox can measure the
   * thumbnail it opens from — and, because the strip follows the lightbox, the
   * different thumbnail it closes back into. Embla's loop repositions slides
   * rather than cloning them, so these stay one-to-one with `photos`.
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
  const [reduced, setReduced] = useState(true);

  /**
   * Autoplay is a courtesy, not a feature: the moment the visitor drives the
   * carousel it is theirs, permanently. Embla's own `stopOnInteraction` is left
   * off because it cannot distinguish "paused because the cursor is resting
   * here" from "the visitor has taken over" — hover should resume, a real
   * interaction should not. So hovering and focus are handed to the plugin and
   * the permanent surrender is tracked here.
   */
  const autoplay = useRef(
    Autoplay({
      delay: INTERVAL_MS,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      // Embla's duration is a physics scalar, not milliseconds. 0 disables the
      // animation outright, which is what reduced motion wants.
      duration: reduced ? 0 : 25,
      watchDrag: !reduced,
    },
    [autoplay.current],
  );

  const [surrendered, setSurrendered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  /** Announced only for changes the visitor made. Autoplay stays silent. */
  const [liveMessage, setLiveMessage] = useState("");

  /**
   * Only the current slide and its two neighbours carry a `src`. Once an index
   * is loaded it stays loaded, so stepping back neither re-fetches nor flashes.
   * The neighbours matter more here than they did before: with a live drag the
   * next slide is partly on screen before the gesture finishes.
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

  const surrender = useCallback(() => {
    setSurrendered(true);
    autoplay.current.stop();
  }, []);

  /* ---- Embla -> React ---------------------------------------------------- */

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => onIndexChange(emblaApi.selectedScrollSnap());
    const syncPlaying = () => setPlaying(autoplay.current.isPlaying());

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", surrender);
    emblaApi.on("autoplay:play", syncPlaying);
    emblaApi.on("autoplay:stop", syncPlaying);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", surrender);
      emblaApi.off("autoplay:play", syncPlaying);
      emblaApi.off("autoplay:stop", syncPlaying);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onIndexChange, surrender]);

  /* ---- React -> Embla ---------------------------------------------------- */

  // The lightbox drives `index` too. Jump rather than animate: closing the
  // viewer on photo five should already be showing photo five, not be halfway
  // through sliding there.
  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== index) emblaApi.scrollTo(index, true);
  }, [emblaApi, index]);

  // Autoplay only runs while the carousel is actually being looked at — and
  // never again once it has been surrendered.
  useEffect(() => {
    if (!emblaApi || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(emblaApi.rootNode());
    return () => observer.disconnect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const shouldPlay = visible && !surrendered && !reduced && count > 1;
    if (shouldPlay) autoplay.current.play();
    else autoplay.current.stop();
    setPlaying(autoplay.current.isPlaying());
  }, [emblaApi, visible, surrendered, reduced, count]);

  /* ---- input ------------------------------------------------------------- */

  const go = useCallback(
    (next: number) => {
      const wrapped = ((next % count) + count) % count;
      surrender();
      setLiveMessage(`${photos[wrapped].alt} — ${wrapped + 1} of ${count}`);
      emblaApi?.scrollTo(wrapped);
    },
    [count, photos, emblaApi, surrender],
  );

  // On the root rather than the viewport: the dots live outside the viewport,
  // so a handler bound there never saw a key press made while a dot had focus.
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
    // Arrow keys are a shortcut for the dot buttons this element contains,
    // which are themselves fully operable by keyboard. The handler sits up here
    // only so it can hear key presses from the dots AND the slides — bound to
    // the viewport it never saw a key pressed while a dot had focus.
    // biome-ignore lint/a11y/noStaticElementInteractions: keyboard shortcut only
    <div
      onKeyDown={onKeyDown}
      className={`${playing ? "is-playing " : ""}${surrendered ? "is-surrendered " : ""}`}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a carousel is a labelled
          group of slides, which is what role=group + aria-roledescription
          describes. No element carries this meaning natively. */}
      <div
        ref={emblaRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label} photos`}
        className="photo-lift sq-lg relative w-full overflow-hidden"
      >
        {/* `will-change-transform` is not a micro-optimisation here. Without
            layer promotion Chrome repaints the full-size photo on every frame
            of the slide instead of compositing an already-painted layer. */}
        <div className="flex will-change-transform">
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
              className="min-w-0 shrink-0 grow-0 basis-full"
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

      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
    </div>
  );
}
