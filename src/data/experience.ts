/**
 * Work history as a route. Array order IS the route (NRO → Deloitte → IBM →
 * NRO) and is deliberately not chronological: the line crosses between tracks
 * twice, which is what the section shows. Do not sort it.
 *
 * `track` picks both the colour and the side (defense left, commercial right).
 * Crossings are derived from consecutive tracks, never stored.
 */

export type Track = "defense" | "commercial";

export interface Role {
  id: string;
  org: string;
  title: string;
  /** Display string, e.g. "2024 — now". */
  period: string;
  track: Track;
}

export const roles: Role[] = [
  {
    id: "nro-intern",
    org: "National Reconnaissance Office",
    title: "Engineering Intern",
    period: "Summer 2023",
    track: "defense",
  },
  {
    id: "deloitte",
    org: "Deloitte",
    title: "Consulting Intern",
    period: "Summer 2024",
    track: "commercial",
  },
  {
    id: "ibm",
    org: "IBM",
    title: "AI + Data Engineer",
    period: "May 2025 - May 2026",
    track: "commercial",
  },
  {
    id: "nro",
    org: "National Reconnaissance Office",
    title: "Enterprise Test and Studies Lead",
    period: "May 2026 — now",
    track: "defense",
  },
];

export const trackLabel: Record<Track, string> = {
  defense: "Defense & Intelligence",
  commercial: "Software & Consulting",
};

export const trackColor = (track: Track): string =>
  track === "defense" ? "var(--color-defense)" : "var(--color-commercial)";
