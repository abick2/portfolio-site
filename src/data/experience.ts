/**
 * Work history, drawn as a roadmap with a centre spine.
 *
 * **Array order is the route, and the route is deliberately not chronological.**
 * It runs NRO → Deloitte → IBM → NRO so the spine crosses between the two
 * tracks twice, which is the thing the section exists to show. A previous
 * version sorted by start year and the crossings collapsed; do not reintroduce
 * a sort.
 *
 * `track` does double duty — it picks the colour AND the side of the spine
 * (defense left, commercial right), matching the two column headers. A separate
 * `side` field would be a second source of truth for the same fact.
 *
 * Crossings are derived, not stored: a stop is a crossing when its track
 * differs from the stop before it. The handoff specified a per-stop flag, but a
 * stored flag can disagree with the order above it, and a derived one cannot.
 *
 * PLACEHOLDER TITLES — the four job titles below are the design handoff's
 * guesses, not Andrew's real ones. Replace before this ships.
 */

export type Track = "defense" | "commercial";

export interface Role {
  id: string;
  org: string;
  /** TODO: placeholder. */
  title: string;
  /** Display string, e.g. "2024 — now". */
  period: string;
  track: Track;
  /**
   * Not rendered on the home page — the roadmap card is org, title, period and
   * nothing else, and the single "Go deeper" pill at the foot of the section
   * stands in for all of it. Kept for the work-experience detail page, which
   * does not exist yet.
   */
  summary: string;
  /** Same: held for the detail page, unrendered today. */
  highlights: string[];
}

export const roles: Role[] = [
  // TODO: replace all of the below with the real history.
  {
    id: "nro-intern",
    org: "NRO",
    title: "Systems Engineering Intern",
    period: "2021 — 2022",
    track: "defense",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder"],
  },
  {
    id: "deloitte",
    org: "Deloitte",
    title: "Technology Consultant",
    period: "2022 — 2024",
    track: "commercial",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder", "Placeholder"],
  },
  {
    id: "ibm",
    org: "IBM",
    title: "Software Engineering Intern",
    period: "2020 — 2021",
    track: "commercial",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder"],
  },
  {
    id: "nro",
    org: "NRO",
    title: "Systems Engineer",
    period: "2024 — now",
    track: "defense",
    summary:
      "Placeholder summary. One or two sentences on what this job actually is, in language a non-engineer would understand.",
    highlights: [
      "Placeholder outcome with a number in it",
      "Placeholder thing you built",
      "Placeholder group of people you got to agree on something",
    ],
  },
];

export const trackMeta: Record<Track, { label: string; blurb: string }> = {
  defense: {
    label: "Defense & Intelligence",
    // TODO
    blurb:
      "Mission systems, classified environments, very high stakes and very long feedback loops.",
  },
  commercial: {
    label: "Software & Consulting",
    // TODO
    blurb:
      "Clients, deadlines, shipping software people outside the building actually use.",
  },
};

/** The track colour, as the CSS custom property the roadmap paints with. */
export const trackColor = (track: Track): string =>
  track === "defense" ? "var(--color-defense)" : "var(--color-commercial)";
