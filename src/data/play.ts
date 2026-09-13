/**
 * The hobby chapters. Each one renders as a numbered row on the home page —
 * text on the left, its own photo carousel on the right — and also has its own
 * page under /play/<slug>.
 *
 * Order here is the order they appear on the page.
 */

import { bestTime, running, triathlon } from "./athletics";

export interface PlayImage {
  src: string;
  alt: string;
  /** Optional caption, shown under the photo in the lightbox. */
  caption?: string;
}

export interface PlayArea {
  slug: string;
  title: string;
  /** One line for the chapter. */
  blurb: string;
  /**
   * The single piece of evidence shown with the chapter. `value` is set large
   * and `label` sits under it. Keep the value short — it is set at display
   * size.
   */
  evidence: { value: string; label: string };
  cover: { src: string; alt: string };
  /** Photos for the chapter carousel. */
  gallery: PlayImage[];
  /** Long-form intro on the detail page. */
  body: string[];
}

/**
 * TEMPORARY. Builds the generated-placeholder gallery for a hobby.
 *
 * When real photos exist, delete this helper and write the arrays out by hand —
 * every photo wants its own alt text, and most want a caption. The alt strings
 * below are positional stand-ins, which is exactly what you do NOT want once
 * the images mean something.
 */
function placeholderGallery(slug: string, title: string, count: number): PlayImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/images/hobbies/${slug}-${i + 1}.svg`,
    alt: `${title} placeholder, ${i + 1} of ${count}`,
  }));
}

export const playAreas: PlayArea[] = [
  {
    slug: "running",
    title: "Running",
    blurb: "Redo this as summary of below [body].",
    evidence: {
      value: bestTime(running, "Half marathon"),
      label: "half marathon best",
    },
    cover: {
      src: "/images/hobbies/running-cover.svg",
      alt: "Placeholder running image",
    },
    gallery: placeholderGallery("running", "Running", 6),
    body: [
      "Running is my mediation. It's what keeps me calm throughout the craziness of life. It's what I turn to for some alone time, and what I do to relax. It's an extension of my most fundamental love of exploration. I think it's taught me the most about life and helped define my personality in ways I find hard to explain. Most importantly, it's taught me the skill of perseverance, which I aim to take with me in every other part of my life.",
      "Running is an extension of my personality. It's exploration, it's perseverance, it can be both isolating and contemplative or social and connecting people. ",
    ],
  },
  {
    slug: "travel",
    title: "Travel",
    // TODO
    blurb: "TODO. Based on [body] below.",
    evidence: { value: "6", label: "countries pinned so far" },
    cover: { src: "/images/hobbies/travel-cover.svg", alt: "Placeholder travel image" },
    gallery: placeholderGallery("travel", "Travel", 6),
    body: [
      "There's so much to see in the world and learning to appreciate the variety of life has been of the things that's brought me the most happiness in my life. Travel is one of the best ways to explore the variety of life we have on earth.",
      "The happiest moments of my life have all been on trips. ",
      "I lived in Copenhagen, Denmark for 4 month in college. I met my girlfriend on this trip and changed the trajectory of my life. Now we're living together here in Washington DC.",
    ],
  },
  {
    slug: "triathlon",
    title: "Triathlon",
    blurb: "Redo this as summary of below [body].",
    evidence: { value: bestTime(triathlon, "Olympic"), label: "Olympic distance best" },
    cover: {
      src: "/images/hobbies/triathlon-cover.svg",
      alt: "Placeholder triathlon image",
    },
    gallery: placeholderGallery("triathlon", "Triathlon", 6),
    body: [
      "Born out of my role from running. Triathlon has been my most recent athletic challenge. It introduced me to a group of like-minded adventurous, self-challenging people in college.",
    ],
  },
  {
    slug: "food",
    title: "Food",
    blurb: "Restaurant week completionist, home cook the rest of the year.",
    evidence: { value: "∞", label: "opinions about espresso" },
    cover: { src: "/images/hobbies/food-cover.svg", alt: "Placeholder food image" },
    gallery: placeholderGallery("food", "Food", 6),
    body: [
      "Placeholder. Restaurant week, cooking at home, and the through-line to the Gaggia project.",
    ],
  },
];

export const playBySlug = (slug: string) => playAreas.find((p) => p.slug === slug);
