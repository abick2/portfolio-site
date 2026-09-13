"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { PlayArea } from "@/data/play";
import HobbyCarousel from "./HobbyCarousel";
import Lightbox from "./Lightbox";

/**
 * One hobby, set as a chapter: the words on the left, its own carousel on the
 * right.
 *
 * The carousel is controlled from here rather than owning its own index, which
 * is what makes the lightbox and the inline strip stay in step — step through
 * four photos in the expanded view, close it, and the strip is already on the
 * fourth. It also means the closing animation can shrink back into the photo
 * you were actually looking at.
 */
export default function HobbyChapter({
  area,
  numeral,
}: {
  area: PlayArea;
  numeral: string;
}) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const slideRefs = useRef<(HTMLImageElement | null)[]>([]);

  const getThumb = useCallback((i: number) => slideRefs.current[i], []);
  const handleIndexChange = useCallback((next: number) => setIndex(next), []);

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] md:gap-12">
      <div>
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="t-title tabular font-light text-slate-light"
          >
            {numeral}
          </span>
          <h3 className="t-title">{area.title}</h3>
        </div>

        <p className="t-body mt-4 max-w-[52ch]">{area.body[0]}</p>

        {/* Evidence stays the loud element it is elsewhere on the site, but one
            step down from `t-display`: at display size the number was larger
            than the chapter's own name, which inverted the hierarchy. */}
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
          <span className="t-section tabular leading-none">{area.evidence.value}</span>
          <span className="t-small">{area.evidence.label}</span>
        </p>

        <Link
          href={`/play/${area.slug}`}
          className="glass-1 sq-full mt-6 inline-flex min-h-11 items-center px-5 text-[0.95rem] transition-transform duration-200 hover:translate-x-1"
        >
          More on {area.title.toLowerCase()}
        </Link>
      </div>

      <HobbyCarousel
        photos={area.gallery}
        label={area.title}
        index={index}
        onIndexChange={handleIndexChange}
        onExpand={(i) => {
          setIndex(i);
          setExpanded(true);
        }}
        slideRefs={slideRefs}
      />

      {expanded && (
        <Lightbox
          photos={area.gallery}
          label={area.title}
          index={index}
          onIndexChange={handleIndexChange}
          onClose={() => setExpanded(false)}
          getThumb={getThumb}
        />
      )}
    </div>
  );
}
