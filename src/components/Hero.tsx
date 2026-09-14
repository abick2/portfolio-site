"use client";

import { useEffect, useRef } from "react";
import { playAreas } from "@/data/play";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion, useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * The name, and then the name coming apart.
 *
 * At rest this is the boldest thing on the site: the two words are composited
 * through the fluid simulation with `mix-blend-mode: difference`, so the
 * letterforms are painted BY the field behind them rather than sitting in front
 * of it. A photo tile is set inline between "Andrew" and "Bickford" as if it
 * were a letter, and it cycles.
 *
 * On scroll the name liquifies — an SVG goo filter thresholds its alpha, the
 * words shrink, and a column of ink drains upward out of the top of the word.
 * The nav wordmark fills from the bottom at the same time, off the same scroll
 * value, so the two read as one gesture: the name leaves the page and arrives
 * in the header.
 *
 * ─── Four things here will break if you move them ────────────────────────────
 *
 * 1. NOTHING between a `.knockout` span and the canvas may create a stacking
 *    context — no `z-index`, no `transform`, no `filter`, no `position:
 *    sticky/fixed`. That is why the hero is a plain scrolling section rather
 *    than a pinned one, and why the scroll `transform` lives on a span INSIDE
 *    each word instead of on the word itself. (A sticky hero was tried during
 *    the design: both name words went invisible.)
 *
 * 2. `.rise` is `animation-fill-mode: both`, so its final keyframe pins
 *    `opacity: 1; transform: none` over any inline style, forever. No element
 *    may carry both `.rise` and a scroll-driven opacity or transform — hence
 *    the wrapper/inner pairs on the lede, the CTA row and the photo tile.
 *
 * 3. The goo filter must be `none`, not `url(#goo)` at zero blur. Its
 *    `feColorMatrix` alpha row hard-thresholds alpha and shreds the
 *    antialiasing on the largest type on the site even when `stdDeviation` is
 *    0.
 *
 * 4. The cycling photo layer is driven imperatively through a ref. Binding an
 *    `<img src>` to state fires a request for the unresolved value on the
 *    frames where it is briefly undefined.
 */

/** The portrait, plus the four hobby covers it cycles through. */
const PORTRAIT = "/images/portrait/profile_pic.jpg";

const CYCLE = playAreas
  .map((area) => area.gallery[0].src)
  .filter((src): src is string => src !== null);

const CYCLE_MS = 2800;

export default function Hero() {
  const layerRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();
  const p = useScrollProgress();

  /*
    The whole cycle runs outside React. The alternative — an index in state —
    re-renders the entire hero every 2.8 seconds to change two opacities, and
    the hero is already the most render-sensitive component on the page because
    it also tracks scroll.
  */
  useEffect(() => {
    if (reduced || CYCLE.length === 0) return;

    for (const src of CYCLE) {
      const preload = new Image();
      preload.src = src;
    }

    // -1 is the portrait; 0…n-1 are the covers.
    let index = -1;

    const timer = window.setInterval(() => {
      index = index >= CYCLE.length - 1 ? -1 : index + 1;
      const layer = layerRef.current;
      const portrait = portraitRef.current;
      if (!layer || !portrait) return;

      if (index < 0) {
        layer.style.opacity = "0";
        portrait.style.opacity = "1";
      } else {
        layer.style.backgroundImage = `url(${CYCLE[index]})`;
        layer.style.opacity = "1";
        portrait.style.opacity = "0";
      }
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [reduced]);

  // These ramps were tuned against the design, not derived. The ordering
  // matters more than the constants: the tile is gone by p ≈ 0.28, which is
  // before the goo is strong enough to smear it, and the lede clears by
  // p ≈ 0.33 so nothing readable is inside the filter while it ramps.
  const liquid = p > 0.16;
  const goo = (Math.max(0, p - 0.16) / 0.84) * 13;
  const nameScale = 1 - p * 0.44;
  const streamHeight = `${(Math.max(0, p - 0.14) / 0.86) * 40}vh`;
  const tileOpacity = Math.max(0, 1 - Math.max(0, p - 0.1) / 0.18);
  const ledeOpacity = Math.max(0, 1 - p * 3);

  /*
    Once the filter is on, the wrapper is a stacking context and the blend is
    isolated anyway — so the knockout is dropped deliberately rather than left
    to fail. Applied inline and only while liquifying: `.knockout`'s resting
    state has to stay under its `@supports (mix-blend-mode: difference)` guard,
    because without blending support white type on pale paper is invisible.
  */
  /*
    The design sets the photo tile between the two words, so the name has to be
    split — but it is split from `profile.name`, not retyped. Nav's wordmark and
    layout.tsx's <title> both render that same string, and a hero that hardcoded
    "Andrew" / "Bickford" would quietly keep the old name after a rename while
    everything around it updated.
  */
  const [firstWord, ...restWords] = profile.name.split(" ");
  const lastWord = restWords.join(" ");

  const nameOverride = liquid
    ? ({ color: "var(--color-ink)", mixBlendMode: "normal" } as const)
    : null;

  const wordStyle = {
    willChange: "transform",
    ...nameOverride,
  } as const;

  const scaleStyle = {
    display: "inline-block",
    transform: `scale(${nameScale})`,
    transformOrigin: "0 50%",
  } as const;

  return (
    <section
      id="top"
      className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-[8vh] pb-[16vh]"
    >
      {/* One instance, hidden, referenced by the wrapper's `filter`. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <title>Hero liquify filter</title>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation={goo} result="blur" />
            {/* The alpha row is the goo: it multiplies alpha by 22 and shifts
                it by -10, which snaps the blurred edges back into hard ones so
                nearby shapes fuse instead of fading. It is also why this filter
                must be switched off entirely at rest — that same threshold
                destroys type antialiasing. */}
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative" style={{ filter: liquid ? "url(#goo)" : "none" }}>
        {/* The ink draining out of the top of the name. Inside the filter, so
            it fuses with the letterforms rather than reading as a bar. */}
        <div
          aria-hidden="true"
          className="sq-full absolute"
          style={{
            bottom: "94%",
            left: "0.09em",
            width: "clamp(16px, 2.2vw, 28px)",
            height: streamHeight,
            background: "var(--color-ink)",
          }}
        />

        {/*
          Both words live inside the one `<h1>` so the heading's accessible name
          is the whole name. The design draws the last word on a second line
          beside the photo tile, but splitting it into a sibling of the heading
          would leave the site's only h1 announcing half a name.

          Everything inside is a `<span>`: an `<h1>` takes phrasing content, so
          a `<div>` here would be invalid markup even though it would render.
        */}
        <h1 className="t-hero">
          <span className="knockout rise block" style={wordStyle}>
            <span style={scaleStyle}>{firstWord}</span>
          </span>

          <span className="mt-[0.02em] flex items-center gap-[0.16em]">
            {/* Decorative: the h1 already says the name, and About carries the
                portrait with a real alt. An alt here would make the heading
                announce the name twice over. */}
            <span
              aria-hidden="true"
              className="rise block h-[0.82em] flex-none"
              style={{ aspectRatio: "3 / 4", animationDelay: "120ms" }}
            >
              <span
                className="photo-lift sq relative block h-full w-full overflow-hidden"
                style={{
                  opacity: tileOpacity,
                  transition: "opacity .35s ease",
                }}
              >
                <img
                  ref={portraitRef}
                  src={PORTRAIT}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ transition: "opacity .7s ease" }}
                />
                <span
                  ref={layerRef}
                  className="absolute inset-0 block bg-cover bg-center"
                  style={{ opacity: 0, transition: "opacity .7s ease" }}
                />
              </span>
            </span>

            <span
              className="knockout rise"
              style={{ ...wordStyle, animationDelay: "90ms" }}
            >
              <span style={scaleStyle}>{lastWord}</span>
            </span>
          </span>
        </h1>
      </div>

      {/* `.rise` outside, scroll-driven opacity inside — see note 2 above. */}
      <div className="rise mt-11" style={{ animationDelay: "300ms" }}>
        <p
          className="t-lead max-w-[30ch]"
          style={{ opacity: ledeOpacity, transition: "opacity .3s ease" }}
        >
          {profile.lede}
        </p>
      </div>

      <div className="rise mt-8" style={{ animationDelay: "420ms" }}>
        {/*
          `visibility` rather than opacity alone. At opacity 0 these are still
          in the tab order, so a keyboard user scrolling past the hero lands on
          two links they cannot see. Hiding is instant, but only once the fade
          has already finished.
        */}
        <div
          className="flex flex-wrap gap-2.5"
          style={{
            opacity: ledeOpacity,
            visibility: ledeOpacity === 0 ? "hidden" : "visible",
            transition: "opacity .3s ease",
          }}
        >
          <a
            href="#work"
            className="sq-full bg-ink px-[26px] py-[13px] text-paper transition-transform duration-[250ms] hover:-translate-y-[3px] hover:scale-[1.04]"
          >
            See the work
          </a>
          <a
            href="#play"
            className="glass-2 sq-full px-[26px] py-[13px] transition-transform duration-[250ms] hover:-translate-y-[3px] hover:scale-[1.04]"
          >
            Or the fun stuff
          </a>
        </div>
      </div>
    </section>
  );
}
