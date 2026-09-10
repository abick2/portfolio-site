/**
 * The hobby doorways on the home page. Each one links to its own page under
 * /play/<slug>.
 *
 * These are intentionally not "cards with an icon and a sentence" — each tile
 * carries a different piece of evidence (a map, a time, a count), so the four
 * of them do not read as one repeated component.
 */

export interface PlayArea {
  slug: string;
  title: string;
  /** One line for the tile. */
  blurb: string;
  /**
   * The single piece of evidence shown on the tile. `value` is set large and
   * `label` sits under it. Keep the value short — it is set at display size.
   */
  evidence: { value: string; label: string };
  cover: { src: string; alt: string };
  /** Long-form intro on the detail page. */
  body: string[];
}

export const playAreas: PlayArea[] = [
  {
    slug: "travel",
    title: "Travel",
    // TODO
    blurb: "Somewhere new as often as I can justify it.",
    evidence: { value: "6", label: "countries pinned so far" },
    cover: { src: "/images/hobbies/travel-cover.svg", alt: "Placeholder travel image" },
    body: [
      "Placeholder. Why you travel, and what you are actually looking for when you do.",
    ],
  },
  {
    slug: "triathlon",
    title: "Triathlon",
    blurb: "Three sports, none of them mastered, all of them improving.",
    evidence: { value: "0:00:00", label: "Olympic distance best" },
    cover: { src: "/images/hobbies/triathlon-cover.svg", alt: "Placeholder triathlon image" },
    body: [
      "Placeholder. What got you into it, and what the training actually looks like week to week.",
    ],
  },
  {
    slug: "running",
    title: "Running",
    blurb: "The one that came first and never went away.",
    evidence: { value: "0:00:00", label: "half marathon best" },
    cover: { src: "/images/hobbies/running-cover.svg", alt: "Placeholder running image" },
    body: [
      "Placeholder. The mile and the half are the two you care about — say why those two.",
    ],
  },
  {
    slug: "food",
    title: "Food",
    blurb: "Restaurant week completionist, home cook the rest of the year.",
    evidence: { value: "∞", label: "opinions about espresso" },
    cover: { src: "/images/hobbies/food-cover.svg", alt: "Placeholder food image" },
    body: [
      "Placeholder. Restaurant week, cooking at home, and the through-line to the Gaggia project.",
    ],
  },
];

export const playBySlug = (slug: string) => playAreas.find((p) => p.slug === slug);
