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
    blurb: "A site for tracking startups and simulating a venture fund.",
    year: "2026",
    tags: ["Next.js", "Venture", "Due-Diligence"],
    cover: {
      src: "/images/projects/venture-cover.webp",
      alt: "The Bickford Ventures deal pipeline: four columns of companies, from discovery to exit.",
    },
    coverWide: {
      src: "/images/projects/venture-hero.webp",
      alt: "The Bickford Ventures deal pipeline: four columns of companies, from discovery to exit.",
    },
    body: [
      "I created this site to help practice the skills necessary for a venture capital career. It keeps all information in one place, links investment memos I've written, and tracks fund metrics over time. ",
    ],
    gallery: [],
    links: [{ label: "Visit the site", href: "https://venture-sim.vercel.app" }],
  },
  {
    slug: "triathlon-training",
    title: "Triathlon training",
    blurb: "Training plans built with an agent, available on any device.",
    year: "2026",
    tags: ["Agents", "Next.js", "Strava API", "Neon"],
    cover: {
      src: "/images/projects/triathlon-cover.webp",
      alt: "The training site's Today view: the day's workout, the week's mileage, and what is up next.",
    },
    coverWide: {
      src: "/images/projects/triathlon-hero.webp",
      alt: "The training site's Today view: the day's workout, the week's mileage, and what is up next.",
    },
    body: [
      "A simple UI for viewing triathlon (or running) training plans, and a customized agent to streamline the training plan build process.",
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
    body: [
      "Built over the COVID-19 lockdown, this is a first person view (FPV) racing drone capable of speeds over 100 mph. At Virginia Tech I was a member of the drone racing club.",
    ],
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
      "While in school at Virginia Tech, I made it a goal of mine to run every street in town. I created this site to help track and highlight which roads I have yet to complete. I didn't quite hit all of them during my 4 years, but I got close!",
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
    blurb: "Upgrading my espresso machine.",
    year: "2026",
    tags: ["Electronics", "Hardware", "Coffee"],
    cover: {
      src: "/images/projects/gaggia-pic.jpeg",
      alt: "Placeholder cover image for the Gaggia Classic espresso machine mods",
      position: "50% 40%",
    },
    body: [
      "This is an ongoing project I'm working on to modify a Gaggia Classic espresso machine. The idea is to upgrade the capabilities of a cheaper machine to match those of a multi-thousand dollar machine for a fraction of the price. Upgrades will include a pressure monitoring system, temperature regulation system, touch screen display, and flow rate profiling.",
    ],
    gallery: [],
  },
  // {
  //   slug: "edge-ai-drone-detection",
  //   title: "Edge AI for drone detection",
  //   blurb: "A detection model on embedded hardware.",
  //   year: "2025",
  //   tags: ["Convolutional Neural Networks", "Machine Learning", "Raspberry-Pi"],
  //   cover: {
  //     src: null,
  //     alt: "Placeholder cover image for the edge AI drone detection project",
  //   },
  //   body: [
  //     "My group senior design project. We developed an audio based drone detection system using an embedded AI accelerator, the Hailo 8, on a Raspberry Pi. This system worked by converting an audio signal over a time window to a spectrogram and processing these spectrogram images using MobileNetV3 determine if a drone was present.",
  //   ],
  //   gallery: [],
  // },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
