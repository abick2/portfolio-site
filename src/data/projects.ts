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
  /**
   * Manual crop. Every frame on the site is `object-fit: cover`, so an image
   * whose shape does not match its frame gets its edges cut off — this chooses
   * *which* edges. Any CSS `object-position` value: `"58% 0%"` pulls the image
   * left and pins it to the top, `"center"` centres it, `"left bottom"` works
   * too. Left unset, a cover sits top-centre and a gallery frame centres.
   *
   * Only has an effect where the image is wider (or taller) than its frame —
   * a shot cut to exactly the frame's ratio has nothing to slide.
   */
  position?: string;
}

export interface Project {
  slug: string;
  title: string;
  /**
   * One line for the card, and the lede at the top of the detail page. Kept
   * genuinely short — the mosaic caption is title, year and this, and a
   * sentence that wraps to three lines pushes the panel off its card.
   * Say what it is, not why it is impressive.
   */
  blurb: string;
  year: string;
  kind: ProjectKind;
  span: ProjectSpan;
  /** Short tags — tools, domains. Kept to four or fewer. */
  tags: string[];
  /** Hero image for the mosaic card, and the fallback for the detail page. */
  cover: ProjectImage;
  /**
   * Optional 16/9 version of the cover, used only by the detail page's frame.
   * The mosaic cards are square (or, for a `tall` span, close to 1:2), so a
   * cover shaped for one of them loses most of itself to a 16/9 crop. That
   * does not matter for an abstract placeholder; it matters a lot for the
   * three projects whose cover is a screenshot of a live site, because the
   * crop throws away the half of the page that identifies it.
   */
  coverWide?: ProjectImage;
  /** Long-form paragraphs for the detail page. */
  body: string[];
  /** Gallery below the body. This is where the picture-heavy brief gets met. */
  gallery: ProjectImage[];
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "venture-portfolio",
    title: "Venture portfolio",
    blurb: "Tracking startups I follow, and the theses behind them.",
    year: "2026",
    kind: "software",
    span: "unit",
    tags: ["Next.js", "Venture", "Design", "Due-Diligence"],
    cover: {
      src: "/images/projects/venture-cover.webp",
      alt: "The Bickford Ventures deal pipeline: four columns of companies, from discovery to exit.",
    },
    coverWide: {
      src: "/images/projects/venture-hero.webp",
      alt: "The Bickford Ventures deal pipeline: four columns of companies, from discovery to exit.",
    },
    body: [
      "Placeholder. This one is a good translator story — the interesting part is almost certainly the handoff to people who do not write code.",
    ],
    gallery: [{ src: "/images/projects/venture-1.svg", alt: "Placeholder" }],
    links: [{ label: "Visit the site", href: "https://venture-sim.vercel.app" }],
  },
  {
    slug: "triathlon-training",
    title: "Triathlon training",
    blurb: "Plans built with an agent, readable on any device.",
    year: "2026",
    kind: "software",
    span: "unit",
    tags: ["Agents", "Next.js", "Strava API"],
    cover: {
      src: "/images/projects/triathlon-cover.webp",
      alt: "The training site's Today view: the day's workout, the week's mileage, and what is up next.",
    },
    coverWide: {
      src: "/images/projects/triathlon-hero.webp",
      alt: "The training site's Today view: the day's workout, the week's mileage, and what is up next.",
    },
    body: [
      "Talk about agents with access to Neon databse and how training plans are devleoped with human-ai teaming.",
    ],
    gallery: [{ src: "/images/projects/triathlon-1.svg", alt: "Placeholder" }],
    links: [
      {
        label: "Visit the site",
        href: "https://triathlon-training-site-v2.vercel.app/today",
      },
    ],
  },
  {
    slug: "racing-drone",
    title: "Racing drone",
    blurb: "FPV build from lockdown. Past 100 mph.",
    year: "2023",
    kind: "hardware",
    span: "unit",
    tags: ["FPV", "Soldering", "Betaflight", "Drone"],
    cover: {
      src: "/images/projects/racing-drone.jpeg",
      alt: "Placeholder cover image for the racing drone build",
    },
    body: ["Add in some videos/photos from flights taken with this drone."],
    gallery: [
      { src: "/images/projects/drone-build-1.svg", alt: "Placeholder" },
      { src: "/images/projects/drone-build-2.svg", alt: "Placeholder" },
    ],
  },
  {
    slug: "blacksburg-road-coverage",
    title: "Blacksburg road coverage",
    blurb: "I tried to run every street in town. This map kept score.",
    year: "2026",
    kind: "software",
    span: "tall",
    tags: ["OpenStreetMap", "Strava API", "Geospatial"],
    cover: {
      src: "/images/projects/coverage-cover.webp",
      alt: "The coverage map: 82.5% of Blacksburg's roads run, drawn in blue over the streets still unrun in orange.",
      /* Pulled left off centre so the card favours the right of the map. */
      position: "10% 0%",
    },
    coverWide: {
      src: "/images/projects/coverage-hero.webp",
      alt: "The coverage map: 82.5% of Blacksburg's roads run, drawn in blue over the streets still unrun in orange.",
    },
    body: [
      "As you can see, I was close to my goal but missed a few spots. I'll be back!",
    ],
    gallery: [{ src: "/images/projects/coverage-1.svg", alt: "Placeholder" }],
    links: [
      {
        label: "Visit the site",
        href: "https://abick2.github.io/strava-burg-coverage/",
      },
    ],
  },
  {
    slug: "gaggia-classic-mods",
    title: "Gaggia Classic mods",
    blurb: "PID, pressure profiling, an ongoing argument with an Italian machine.",
    year: "2026",
    kind: "hardware",
    span: "wide",
    tags: ["Electronics", "Hardware", "Coffee"],
    cover: {
      src: "/images/projects/gaggia-pic.jpeg",
      alt: "Placeholder cover image for the Gaggia Classic espresso machine mods",
      position: "50% 40%",
    },
    body: [
      "Placeholder. Control theory applied to breakfast. The temperature-stability story is genuinely technical and completely approachable, which makes it the best possible demonstration of the translator pitch.",
    ],
    gallery: [
      { src: "/images/projects/gaggia-1.svg", alt: "Placeholder" },
      { src: "/images/projects/gaggia-2.svg", alt: "Placeholder" },
    ],
  },
  {
    slug: "edge-ai-drone-detection",
    title: "Edge AI for drone detection",
    blurb: "A detection model on hardware small enough to fly.",
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
      {
        src: "/images/projects/drone-detection-1.svg",
        alt: "Placeholder",
        caption: "Placeholder caption",
      },
      { src: "/images/projects/drone-detection-2.svg", alt: "Placeholder" },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
