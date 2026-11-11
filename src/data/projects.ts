// TODO: placeholder copy throughout.

export interface ProjectImage {
  /** `null` until there is a photograph; renders as "Photo to come". */
  src: string | null;
  alt: string;
  /** Shown under the image on the detail page. */
  caption?: string;
  /** Manual crop: any CSS `object-position` value, e.g. "50% 40%". */
  position?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One short line: the grid label and the detail-page lede. */
  blurb: string;
  year: string;
  tags: string[];
  /** 4:3, for the home grid. */
  cover: ProjectImage;
  /** 16:9, for the detail page. Falls back to `cover`. */
  coverWide?: ProjectImage;
  body: string[];
  gallery: ProjectImage[];
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "venture-portfolio",
    title: "Venture portfolio",
    blurb: "Tracking startups I follow, and the theses behind them.",
    year: "2026",
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
    gallery: [],
    links: [{ label: "Visit the site", href: "https://venture-sim.vercel.app" }],
  },
  {
    slug: "triathlon-training",
    title: "Triathlon training",
    blurb: "Plans built with an agent, readable on any device.",
    year: "2026",
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
    gallery: [],
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
    tags: ["FPV", "Soldering", "Betaflight", "Drone"],
    cover: {
      src: "/images/projects/racing-drone.jpeg",
      alt: "Placeholder cover image for the racing drone build",
    },
    body: ["Add in some videos/photos from flights taken with this drone."],
    gallery: [],
  },
  {
    slug: "blacksburg-road-coverage",
    title: "Blacksburg road coverage",
    blurb: "I tried to run every street in town. This map kept score.",
    year: "2026",
    tags: ["OpenStreetMap", "Strava API", "Geospatial"],
    cover: {
      src: "/images/projects/coverage-cover.webp",
      alt: "The coverage map: 82.5% of Blacksburg's roads run, drawn in blue over the streets still unrun in orange.",
    },
    coverWide: {
      src: "/images/projects/coverage-hero.webp",
      alt: "The coverage map: 82.5% of Blacksburg's roads run, drawn in blue over the streets still unrun in orange.",
    },
    body: [
      "As you can see, I was close to my goal but missed a few spots. I'll be back!",
    ],
    gallery: [],
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
    tags: ["Electronics", "Hardware", "Coffee"],
    cover: {
      src: "/images/projects/gaggia-pic.jpeg",
      alt: "Placeholder cover image for the Gaggia Classic espresso machine mods",
      position: "50% 40%",
    },
    body: [
      "Placeholder. Control theory applied to breakfast. The temperature-stability story is genuinely technical and completely approachable, which makes it the best possible demonstration of the translator pitch.",
    ],
    gallery: [],
  },
  {
    slug: "edge-ai-drone-detection",
    title: "Edge AI for drone detection",
    blurb: "A detection model on hardware small enough to fly.",
    year: "2020",
    tags: ["Computer vision", "Embedded", "Capstone"],
    cover: {
      src: null,
      alt: "Placeholder cover image for the edge AI drone detection project",
    },
    body: [
      "Placeholder. Open with the constraint that made this interesting — presumably that inference had to happen on the device rather than in a datacenter, and that changes every decision downstream.",
      "Placeholder. Then the approach: what model, what hardware, what you gave up to fit inside the power and latency budget.",
      "Placeholder. Then the honest part — what did not work, and what you would do differently.",
    ],
    gallery: [],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
