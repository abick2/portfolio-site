/**
 * The four hobby rows on the home page, each with its own page at
 * /play/<slug>.
 *
 * **Array order is render order** — the rows are numbered 01–04 from it, and
 * they alternate text-left / photo-left down the page, so reordering this list
 * reflows the whole section.
 *
 * Each row carries one number set at display size. A count and three race times
 * are a more interesting thing to meet than four icons, and the times come from
 * `athletics.ts` rather than being retyped here — a PR should only ever be
 * updated in one place.
 */

import { bestTime, running, triathlon } from "./athletics";

/**
 * One carousel frame.
 *
 * `src: null` is a frame that exists in the layout but has no photograph yet —
 * the design was built expecting real photography and deliberately leaves the
 * holes visible rather than padding the strip with more placeholder gradients.
 * `placeholder` names what belongs there. Drop a real file in and set `src`.
 */
export interface GalleryFrame {
  src: string | null;
  alt: string;
  placeholder?: string;
}

export interface PlayArea {
  slug: string;
  title: string;
  /** Small uppercase label above the row heading, e.g. "Travel". */
  eyebrow: string;
  /** The row's own headline — a claim, not a category name. */
  heading: string;
  /** One line. Also used as the lede on the detail page. */
  blurb: string;
  /**
   * The single piece of evidence for the row. `value` is set at display size
   * and `label` sits under it. Keep the value short.
   */
  evidence: { value: string; label: string };
  /** Carousel frames. The first is the cover; the rest await real photos. */
  gallery: GalleryFrame[];
  /** Long-form intro on the detail page. */
  body: string[];
}

export const playAreas: PlayArea[] = [
  {
    slug: "travel",
    title: "Travel",
    eyebrow: "Travel",
    heading: "Six countries pinned",
    blurb:
      "Four months living in Copenhagen redirected everything after it. The happiest days of my life have all been on trips.",
    evidence: { value: "6", label: "countries so far" },
    gallery: [
      { src: "/images/hobbies/travel-cover.svg", alt: "" },
      { src: null, alt: "", placeholder: "Copenhagen" },
      { src: null, alt: "", placeholder: "Another trip" },
    ],
    body: [
      "There's so much to see in the world and learning to appreciate the variety of life has been of the things that's brought me the most happiness in my life. Travel is one of the best ways to explore the variety of life we have on earth.",
      "The happiest moments of my life have all been on trips. ",
      "I lived in Copenhagen, Denmark for 4 month in college. I met my girlfriend on this trip and changed the trajectory of my life. Now we're living together here in Washington DC.",
    ],
  },
  {
    slug: "running",
    title: "Running",
    eyebrow: "Running",
    heading: "My meditation",
    blurb:
      "It taught me perseverance long before it taught me anything about pace. Marathon debut October 2026.",
    evidence: {
      value: bestTime(running, "Half marathon"),
      label: "half marathon best",
    },
    gallery: [
      { src: "/images/hobbies/running-cover.svg", alt: "" },
      { src: null, alt: "", placeholder: "A race" },
      { src: null, alt: "", placeholder: "A long run" },
    ],
    body: [
      "Running is my mediation. It's what keeps me calm throughout the craziness of life. It's what I turn to for some alone time, and what I do to relax. It's an extension of my most fundamental love of exploration. I think it's taught me the most about life and helped define my personality in ways I find hard to explain. Most importantly, it's taught me the skill of perseverance, which I aim to take with me in every other part of my life.",
      "Running is an extension of my personality. It's exploration, it's perseverance, it can be both isolating and contemplative or social and connecting people. ",
    ],
  },
  {
    slug: "triathlon",
    title: "Triathlon",
    eyebrow: "Triathlon",
    heading: "Three sports, one clock",
    blurb: "Running again…but with two more challenges.",
    evidence: {
      value: bestTime(triathlon, "Olympic"),
      label: "olympic distance best",
    },
    gallery: [
      { src: "/images/hobbies/triathlon-cover.svg", alt: "" },
      { src: null, alt: "", placeholder: "Collegiate nationals" },
    ],
    body: [
      "Born out of my role from running. Triathlon has been my most recent athletic challenge. It introduced me to a group of like-minded adventurous, self-challenging people in college.",
    ],
  },
  {
    slug: "food",
    title: "Food",
    eyebrow: "Food",
    heading: "Espresso nerd",
    blurb: "Espresso machine upgrades. Restaurant week enthusiast.",
    evidence: { value: "∞", label: "opinions about espresso" },
    gallery: [
      { src: "/images/hobbies/food-cover.svg", alt: "" },
      { src: null, alt: "", placeholder: "Something you cooked" },
    ],
    body: [
      "Placeholder. Restaurant week, cooking at home, and the through-line to the Gaggia project.",
    ],
  },
];

export const playBySlug = (slug: string) => playAreas.find((p) => p.slug === slug);
