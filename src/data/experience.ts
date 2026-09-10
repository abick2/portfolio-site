/**
 * Work history, split into the two tracks the site argues you move between.
 *
 * The `track` field drives which column a role lands in, and `bridge: true`
 * marks the moments where you actually crossed over — those are drawn as
 * connectors between the columns, and they are the point of the whole section.
 *
 * PLACEHOLDER DATES AND TITLES — replace from your resume.
 */

export type Track = "defense" | "commercial";

export interface Role {
  id: string;
  org: string;
  title: string;
  /** Display string, e.g. "2023 — Present". */
  period: string;
  /** Numeric start year, used only for ordering. */
  start: number;
  /** Numeric end year, or null for current. */
  end: number | null;
  track: Track;
  /** Short summary — one or two sentences, plain language. */
  summary: string;
  /** Three or four concrete things. Avoid resume verbs; say what happened. */
  highlights: string[];
  /**
   * Set when this role moved you between worlds. Rendered as a crossing line.
   */
  bridge?: {
    /** What carried across. One short clause. */
    label: string;
  };
}

export const roles: Role[] = [
  // TODO: replace all of the below with your real history.
  {
    id: "current",
    org: "Placeholder Org",
    title: "Placeholder Title",
    period: "2024 — Present",
    start: 2024,
    end: null,
    track: "commercial",
    summary:
      "Placeholder summary. One or two sentences on what this job actually is, in language a non-engineer would understand.",
    highlights: [
      "Placeholder outcome with a number in it",
      "Placeholder thing you built",
      "Placeholder group of people you got to agree on something",
    ],
    bridge: { label: "Brought mission-side rigour into commercial delivery" },
  },
  {
    id: "deloitte",
    org: "Deloitte",
    title: "Placeholder Title",
    period: "2022 — 2024",
    start: 2022,
    end: 2024,
    track: "commercial",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder", "Placeholder"],
  },
  {
    id: "nro",
    org: "NRO",
    title: "Placeholder Title",
    period: "2021 — 2022",
    start: 2021,
    end: 2022,
    track: "defense",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder"],
    bridge: { label: "Moved from mission systems into consulting" },
  },
  {
    id: "ibm",
    org: "IBM",
    title: "Placeholder Title",
    period: "2020 — 2021",
    start: 2020,
    end: 2021,
    track: "commercial",
    summary: "Placeholder summary.",
    highlights: ["Placeholder", "Placeholder"],
  },
];

export const trackMeta: Record<Track, { label: string; blurb: string }> = {
  defense: {
    label: "Defense & Intelligence",
    // TODO
    blurb: "Mission systems, classified environments, very high stakes and very long feedback loops.",
  },
  commercial: {
    label: "Consulting & Software",
    // TODO
    blurb: "Clients, deadlines, shipping software people outside the building actually use.",
  },
};
