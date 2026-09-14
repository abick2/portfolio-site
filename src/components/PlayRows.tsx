"use client";

import { useRef } from "react";
import DeeperLink from "@/components/DeeperLink";
import { playAreas, type PlayArea } from "@/data/play";
import { usePrefersReducedMotion } from "@/hooks/useScrollProgress";

/**
 * The hobbies, given the same room as the work.
 *
 * Four alternating rows rather than a tile grid. A grid of four equal cards
 * says "here are four hobbies"; alternating full rows say each one is worth
 * stopping on, which is the claim the section is actually making — this is the
 * part of the site its owner most wants read.
 *
 * Each row leads with one number set at display size. The photo column is a
 * native scroll-snap carousel, built to hold real photography that does not
 * exist yet: the empty frames are left visible on purpose rather than padded
 * out with more placeholder gradients.
 */

function Row({
  area,
  index,
  onNudge,
  register,
}: {
  area: PlayArea;
  index: number;
  onNudge: (index: number, direction: 1 | -1) => void;
  register: (index: number, el: HTMLDivElement | null) => void;
}) {
  // Rows alternate. The wider column is always the photo one, so the text
  // column stays near its 38ch measure whichever side it lands on.
  const photoLeft = index % 2 === 1;

  const text = (
    <div className={photoLeft ? "order-first wide:order-none" : undefined}>
      <p className="t-eyebrow">
        {String(index + 1).padStart(2, "0")} — {area.eyebrow}
      </p>

      {/* Inline font-size: `.t-section` is unlayered CSS and beats any Tailwind
          utility regardless of specificity. See the note in Nav.tsx. */}
      <h3
        className="t-section mt-2.5"
        style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)" }}
      >
        {area.heading}
      </h3>

      <p className="t-body mt-4.5 max-w-[38ch]">{area.blurb}</p>

      <p className="t-display tabular mt-7 leading-none">{area.evidence.value}</p>
      <p className="t-small mt-1.5">{area.evidence.label}</p>

      <div className="mt-7">
        <DeeperLink
          href={`/play/${area.slug}`}
          label={`Go deeper on ${area.title.toLowerCase()}`}
        />
      </div>
    </div>
  );

  const photos = (
    <div>
      <div className="photo-lift sq-lg relative aspect-[4/3] overflow-hidden">
        <div
          ref={(el) => register(index, el)}
          className="strip flex h-full snap-x snap-mandatory overflow-x-auto"
        >
          {area.gallery.map((frame, i) =>
            frame.src ? (
              <div key={frame.src} className="relative w-full shrink-0 snap-center">
                <img
                  src={frame.src}
                  alt={frame.alt}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
            ) : (
              /*
                A frame with no photograph yet. Announced to nobody — the
                carousel is decorative until it holds real images — but left
                visible so the gap is obvious to whoever fills it.
              */
              <div
                key={`${area.slug}-empty-${i}`}
                aria-hidden="true"
                className="grid w-full shrink-0 snap-center place-items-center bg-paper-deep"
              >
                <p className="t-small px-6 text-center">{frame.placeholder}</p>
              </div>
            ),
          )}
        </div>
      </div>

      {area.gallery.length > 1 && (
        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={() => onNudge(index, -1)}
            aria-label={`Previous ${area.title.toLowerCase()} photo`}
            className="glass-1 sq-full h-[42px] w-[42px] transition-transform duration-200 hover:scale-[1.08]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onNudge(index, 1)}
            aria-label={`Next ${area.title.toLowerCase()} photo`}
            className="glass-1 sq-full h-[42px] w-[42px] transition-transform duration-200 hover:scale-[1.08]"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 items-center gap-7 wide:gap-14 ${
        photoLeft
          ? "wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          : "wide:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      }`}
    >
      {/* DOM order follows the wide layout; `order-first` on the text column
          flips the photo-left rows back below the breakpoint, so every row
          reads text-then-photo in a single column. */}
      {photoLeft ? photos : text}
      {photoLeft ? text : photos}
    </div>
  );
}

export default function PlayRows() {
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  const register = (index: number, el: HTMLDivElement | null) => {
    strips.current[index] = el;
  };

  // One frame per press, measured off the element rather than assumed, so the
  // arrows stay correct at every column width without being told about any of
  // them.
  const onNudge = (index: number, direction: 1 | -1) => {
    const el = strips.current[index];
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section id="play" className="mx-auto max-w-6xl px-6 pb-[12vh]">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="t-section">My life away from the computer</h2>
        <p className="t-small">The part I enjoy sharing most.</p>
      </div>

      <div className="mt-12 flex flex-col gap-24">
        {playAreas.map((area, i) => (
          <Row
            key={area.slug}
            area={area}
            index={i}
            onNudge={onNudge}
            register={register}
          />
        ))}
      </div>
    </section>
  );
}
