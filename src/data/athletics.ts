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
  links?: { label: string; href: string }[];
}

// TODO: all placeholder. The brief flags the mile and the half as the two that
// matter most — those are the two marked `headline`.
export const running: PersonalRecord[] = [
  {
    event: "Half marathon",
    time: "1:15:40",
    race: "Hokie Half Marathon 2025",
    date: "Sep 28, 2025",
    headline: true,
    detail: "5:44 / mi",
    links: [{label: "Strava activity", href: "https://www.strava.com/activities/15965465395/overview"}]
  },
  {
    event: "Mile",
    time: "4:21",
    race: "Placeholder race",
    date: "2021",
    headline: true,
  },
  { event: "5K", time: "16:02", race: "Placeholder race", date: "2021" },
  // { event: "10K", time: "00:00", race: "Placeholder race", date: "2024" },
  { event: "Marathon", time: "0:00:00", race: "Coming Oct 2026!", date: "----" },
];

export const triathlon: PersonalRecord[] = [
  {
    event: "Olympic",
    time: "2:14:23",
    race: "USAT Collegiate Nationals - Mission Viejo, CA",
    date: "2024",
    headline: true,
    detail: "Swim 26:32 · Bike 1:09:21 · Run 36:08",
    links: [{label: "Results", href: "https://www.athlinks.com/event/386058/results/Event/1078405/Course/2464698/Bib/295"}]
  },
  {
    event: "Sprint",
    time: "1:06:51",
    race: "Patriots Sprint 2025 - Williamsburg, VA",
    date: "2025",
    // detail: "Swim 26:32 · Bike 1:09:21 · Run 36:08",
  },
  {
    event: "70.3",
    time: "0:00:00",
    race: "TBD",
    date: "----",
  },
];

/** Split discipline bests, shown as a small supporting set. */
export const splits: PersonalRecord[] = [
  { event: "Swim, 1500m", time: "00:00", race: "Placeholder", date: "2025" },
  { event: "Bike, 40k", time: "0:00:00", race: "Placeholder", date: "2025" },
];

/**
 * Quote a single record's time by event name, for the places that cite one PR
 * outside the tables (the Play tiles do this). Looks up by `event` rather than
 * by index so reordering or inserting records above it cannot silently point
 * the citation at the wrong race.
 *
 * Falls back to an em dash: a renamed event degrades to a visible gap on the
 * tile instead of printing `undefined`.
 */
export const bestTime = (records: PersonalRecord[], event: string): string =>
  records.find((r) => r.event === event)?.time ?? "—";
