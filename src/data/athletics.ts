/**
 * Running and triathlon personal records, hand-maintained so the site stays a
 * static export with no Strava API keys.
 */

export interface PersonalRecord {
  event: string;
  /** As displayed, e.g. "1:28:05". */
  time: string;
  race: string;
  date: string;
  /** Rendered large; everything else is a table row. */
  headline?: boolean;
  /** Pace or splits, shown under a headline time. */
  detail?: string;
  links?: { label: string; href: string }[];
}

export const running: PersonalRecord[] = [
  {
    event: "Marathon",
    time: "2:37:31",
    race: "Marine Corps Marathon",
    date: "Oct 25, 2026",
    headline: true,
  },
  {
    event: "Half marathon",
    time: "1:15:40",
    race: "Hokie Half Marathon",
    date: "Sep 28, 2025",
    headline: true,
    detail: "5:44 / mi",
    links: [
      {
        label: "Strava activity",
        href: "https://www.strava.com/activities/15965465395/overview",
      },
    ],
  },
  {
    event: "Mile",
    time: "4:21",
    race: "High School",
    date: "2021",
    headline: false,
  },
  {
    event: "5K",
    time: "16:02",
    race: "High School",
    date: "2021",
  },
];

export const triathlon: PersonalRecord[] = [
  {
    event: "Olympic",
    time: "2:14:23",
    race: "USAT Collegiate Nationals - Mission Viejo, CA",
    date: "2024",
    headline: true,
    detail: "Swim 26:32 · Bike 1:09:21 · Run 36:08",
    links: [
      {
        label: "Results",
        href: "https://www.athlinks.com/event/386058/results/Event/1078405/Course/2464698/Bib/295",
      },
    ],
  },
  {
    event: "Sprint",
    time: "1:06:51",
    race: "Patriots Sprint 2025 - Williamsburg, VA",
    date: "2025",
  },
];

// TODO: placeholder splits.
export const splits: PersonalRecord[] = [
  {
    event: "Swim, 1500m",
    time: "26:32",
    race: "Nationals 2024 Mission Veijo CA",
    date: "2024",
  },
  {
    event: "Bike, 40k",
    time: "1:08:36",
    race: "Giant Acorn 2025",
    date: "2025",
  },
  {
    event: "Run, 5K",
    time: "0:00:00",
    race: "Giant Acorn 2025",
    date: "2025",
  },
];

/** One record's time by event name, or an em dash if the event is missing. */
export const bestTime = (records: PersonalRecord[], event: string): string =>
  records.find((r) => r.event === event)?.time ?? "—";
