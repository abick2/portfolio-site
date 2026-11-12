import { bestTime, running, triathlon } from "./athletics";
import { countries } from "./travel";

export interface GalleryFrame {
  /** `null` until there is a photograph; renders as "Photo to come". */
  src: string | null;
  alt: string;
  /** Manual crop: any CSS `object-position` value. */
  position?: string;
}

export interface PlayArea {
  slug: string;
  title: string;
  /** One line under the title on the home grid. */
  heading: string;
  /** The detail-page lede. */
  blurb: string;
  /** The one figure on the home grid. */
  evidence: { value: string; label: string };
  /** The first frame is the home-grid cover. */
  gallery: GalleryFrame[];
  body: string[];
}

export const playAreas: PlayArea[] = [
  {
    slug: "travel",
    title: "Travel",
    heading: "What I live for",
    blurb: "The happiest days of my life have all been on trips.",
    evidence: { value: String(countries.length), label: "countries so far" },
    gallery: [{ src: "/images/hobbies/travel-cover.jpeg", alt: "" }],
    body: [
      "There's so much to see in the world and learning to appreciate the variety of life has been of the things that's brought me the most happiness in my life. Travel is one of the best ways to explore the variety of life we have on earth.",
      "The happiest moments of my life have all been on trips. ",
      "I lived in Copenhagen, Denmark for 4 month in college. I met my girlfriend on this trip and changed the trajectory of my life. Now we're living together here in Washington DC.",
    ],
  },
  {
    slug: "running",
    title: "Running",
    heading: "My meditation",
    blurb:
      "It taught me perseverance long before it taught me anything about pace. Marathon debut October 2026.",
    evidence: {
      value: bestTime(running, "Half marathon"),
      label: "half marathon best",
    },
    gallery: [
      {
        src: "/images/hobbies/running-cover.jpeg",
        alt: "Mid-race on a tree-lined road, bib on, another runner just behind.",
        // Low anchor so the 16:9 detail frame keeps the leading foot.
        position: "50% 85%",
      },
    ],
    body: [
      "Running is my mediation. It's what keeps me calm throughout the craziness of life. It's what I turn to for some alone time, and what I do to relax. It feeds my desire to explore. It's taught me a lot about life and helped define my personality in ways I find hard to explain. Most importantly, it's taught me the skill of perseverance, which I aim to take with me in every other part of my life.",
    ],
  },
  {
    slug: "triathlon",
    title: "Triathlon",
    heading: "My newest athletic adventure",
    blurb: "Running again…but with two more challenges.",
    evidence: {
      value: bestTime(triathlon, "Olympic"),
      label: "olympic distance best",
    },
    gallery: [
      {
        src: "/images/hobbies/triathlon-cover.jpeg",
        alt: "Five Virginia Tech triathletes at the finish line in race kit, medals on.",
      },
    ],
    body: [
      "Born out of my role from running. Triathlon has been my most recent athletic challenge. It introduced me to a group of like-minded adventurous, self-challenging people in college.",
    ],
  },
  // {
  //   slug: "food",
  //   title: "Food",
  //   heading: "Calorie connoisseur",
  //   blurb: "Espresso machine upgrades. Restaurant week enthusiast.",
  //   evidence: { value: "∞", label: "opinions about espresso" },
  //   gallery: [{ src: null, alt: "" }],
  //   body: [
  //     "Placeholder. Restaurant week, cooking at home, and the through-line to the Gaggia project.",
  //   ],
  // },
];

export const playBySlug = (slug: string) => playAreas.find((p) => p.slug === slug);
