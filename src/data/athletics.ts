/**
 * Running and triathlon personal records.
 *
 * Hand-maintained on purpose: this keeps the site a pure static export with no
 * API keys, no token refresh, and no Strava rate limits. PRs change a few times
 * a year; a commit is cheaper than an OAuth integration.
 *
 * If you later want these live, keep this exact shape and swap the import for a
 * fetch — the components take the data as props and do not care where it came
 * from.
 *
 * PLACEHOLDER TIMES — replace with your real records.
 */

export interface PersonalRecord {
  /** Distance or event name. */
  event: string;
  /** Finishing time as displayed, e.g. "1:28:05". */
  time: string;
  /** Where it happened. */
  race: string;
  /** ISO-ish year-month, used for sorting and display. */
  date: string;
  /**
   * Marks the records you care most about. Rendered larger; everything else is
   * a supporting row.
   */
  headline?: boolean;
  /** Optional pace or split, shown as secondary detail. */
  detail?: string;
}

// TODO: all placeholder. The brief flags the mile and the half as the two that
// matter most — those are the two marked `headline`.
export const running: PersonalRecord[] = [
  {
    event: "Half marathon",
    time: "0:00:00",
    race: "Placeholder race",
    date: "2025",
    headline: true,
    detail: "0:00 / mi",
  },
  {
    event: "Mile",
    time: "0:00",
    race: "Placeholder race",
    date: "2024",
    headline: true,
  },
  { event: "5K", time: "00:00", race: "Placeholder race", date: "2024" },
  { event: "10K", time: "00:00", race: "Placeholder race", date: "2024" },
  { event: "Marathon", time: "0:00:00", race: "Placeholder race", date: "2025" },
];

export const triathlon: PersonalRecord[] = [
  {
    event: "Olympic",
    time: "0:00:00",
    race: "Placeholder race",
    date: "2025",
    headline: true,
    detail: "Swim 00:00 · Bike 0:00:00 · Run 00:00",
  },
  {
    event: "Sprint",
    time: "0:00:00",
    race: "Placeholder race",
    date: "2024",
  },
  {
    event: "70.3",
    time: "0:00:00",
    race: "Placeholder race",
    date: "2025",
  },
];

/** Split discipline bests, shown as a small supporting set. */
export const splits: PersonalRecord[] = [
  { event: "Swim, 1500m", time: "00:00", race: "Placeholder", date: "2025" },
  { event: "Bike, 40k", time: "0:00:00", race: "Placeholder", date: "2025" },
];
