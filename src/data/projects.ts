/**
 * Projects. Each one gets a card in the home mosaic and its own page at
 * /projects/<slug>.
 *
 * `span` drives the mosaic layout — it is a deliberate, hand-set composition
 * rather than a uniform grid, so changing it changes the page rhythm. Keep the
 * total balanced: roughly two `wide`, one `tall`, the rest `unit`.
 *
 * PLACEHOLDER COPY throughout. The shape is right; the words are not yours yet.
 */

export type ProjectSpan = "wide" | "tall" | "unit";
export type ProjectKind = "software" | "hardware" | "research";

export interface ProjectImage {
  src: string;
  alt: string;
  /** Optional caption shown under the image on the detail page. */
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line for the card. Say what it is, not why it is impressive. */
  blurb: string;
  year: string;
  kind: ProjectKind;
  span: ProjectSpan;
  /** Short tags — tools, domains. Kept to four or fewer. */
  tags: string[];
  /** Hero image for the card and the top of the detail page. */
  cover: ProjectImage;
  /** Long-form paragraphs for the detail page. */
  body: string[];
  /** Gallery below the body. This is where the picture-heavy brief gets met. */
  gallery: ProjectImage[];
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "edge-ai-drone-detection",
    title: "Edge AI for drone detection",
    blurb:
      "Senior capstone: putting a detection model on hardware small enough to fly.",
    year: "2020",
    kind: "research",
    span: "wide",
    tags: ["Computer vision", "Embedded", "Capstone"],
    cover: {
      src: "/images/projects/drone-detection-cover.svg",
      alt: "Placeholder cover image for the edge AI drone detection project",
    },
    // TODO: the real story. What was hard, what you tried, what you learned.
    body: [
      "Placeholder. Open with the constraint that made this interesting — presumably that inference had to happen on the device rather than in a datacenter, and that changes every decision downstream.",
      "Placeholder. Then the approach: what model, what hardware, what you gave up to fit inside the power and latency budget.",
      "Placeholder. Then the honest part — what did not work, and what you would do differently.",
    ],
    gallery: [
      { src: "/images/projects/drone-detection-1.svg", alt: "Placeholder", caption: "Placeholder caption" },
      { src: "/images/projects/drone-detection-2.svg", alt: "Placeholder" },
    ],
  },
  {
    slug: "venture-portfolio",
    title: "Venture portfolio site",
    blurb: "A public-facing portfolio for a fund, built to be edited by non-engineers.",
    year: "2024",
    kind: "software",
    span: "unit",
    tags: ["Next.js", "CMS", "Design"],
    cover: {
      src: "/images/projects/venture-cover.svg",
      alt: "Placeholder cover image for the venture portfolio site",
    },
    body: [
      "Placeholder. This one is a good translator story — the interesting part is almost certainly the handoff to people who do not write code.",
    ],
    gallery: [{ src: "/images/projects/venture-1.svg", alt: "Placeholder" }],
    links: [{ label: "Visit the site", href: "#" }],
  },
  {
    slug: "triathlon-training",
    title: "Triathlon training site",
    blurb: "Pacing, plans, and progress tracking, built for an audience of one.",
    year: "2025",
    kind: "software",
    span: "unit",
    tags: ["Next.js", "Strava API", "Data viz"],
    cover: {
      src: "/images/projects/triathlon-cover.svg",
      alt: "Placeholder cover image for the triathlon training site",
    },
    body: [
      "Placeholder. Tools built for yourself are the most honest kind — say what you actually needed that nothing else gave you.",
    ],
    gallery: [{ src: "/images/projects/triathlon-1.svg", alt: "Placeholder" }],
    links: [{ label: "Visit the site", href: "#" }],
  },
  {
    slug: "racing-drone",
    title: "Racing drone build",
    blurb: "Built from parts, tuned by feel, crashed enthusiastically.",
    year: "2023",
    kind: "hardware",
    span: "unit",
    tags: ["FPV", "Soldering", "Betaflight"],
    cover: {
      src: "/images/projects/drone-build-cover.svg",
      alt: "Placeholder cover image for the racing drone build",
    },
    body: [
      "Placeholder. This pairs beautifully with the capstone — same airframe world, opposite end of the stack. Worth saying so.",
    ],
    gallery: [
      { src: "/images/projects/drone-build-1.svg", alt: "Placeholder" },
      { src: "/images/projects/drone-build-2.svg", alt: "Placeholder" },
    ],
  },
  {
    slug: "blacksburg-road-coverage",
    title: "Blacksburg road coverage",
    blurb:
      "Every road in town, coloured by whether I have run it. A completionist's map.",
    year: "2024",
    kind: "software",
    span: "tall",
    tags: ["OpenStreetMap", "Strava API", "Geospatial"],
    cover: {
      src: "/images/projects/coverage-cover.svg",
      alt: "Placeholder cover image for the Blacksburg road coverage map",
    },
    body: [
      "Placeholder. The map-matching problem is the meat here — GPS traces do not line up with road centerlines, and explaining how you dealt with that is the good part.",
    ],
    gallery: [{ src: "/images/projects/coverage-1.svg", alt: "Placeholder" }],
    links: [{ label: "Visit the site", href: "#" }],
  },
  {
    slug: "gaggia-classic-mods",
    title: "Gaggia Classic mods",
    blurb: "PID, pressure profiling, and an ongoing argument with an Italian machine.",
    year: "2024",
    kind: "hardware",
    span: "wide",
    tags: ["PID control", "Electronics", "Coffee"],
    cover: {
      src: "/images/projects/gaggia-cover.svg",
      alt: "Placeholder cover image for the Gaggia Classic espresso machine mods",
    },
    body: [
      "Placeholder. Control theory applied to breakfast. The temperature-stability story is genuinely technical and completely approachable, which makes it the best possible demonstration of the translator pitch.",
    ],
    gallery: [
      { src: "/images/projects/gaggia-1.svg", alt: "Placeholder" },
      { src: "/images/projects/gaggia-2.svg", alt: "Placeholder" },
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
