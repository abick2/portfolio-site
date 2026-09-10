import Link from "next/link";
import { projects, type Project } from "@/data/projects";

/**
 * Projects as a hand-composed mosaic rather than a uniform card grid.
 *
 * Sizes come from each project's `span`, and the six of them are arranged so
 * the rows resolve exactly against a six-column grid:
 *
 *   row 1   [ wide  4 ][ unit 2 ]
 *   row 2   [ unit 2 ][ tall 2 ][ unit 2 ]
 *   row 3   [ wide  4 ][   ↑ tall continues  ]
 *
 * Reordering `projects` will change the composition — check it still resolves.
 *
 * The image fills the card and the text sits on a glass panel over it, so these
 * read as photographs rather than as boxes with a picture inside.
 */

/*
  `min-h` is a floor, not decoration. The text panel is absolutely positioned
  from the bottom inside an `overflow-hidden` box, so wherever the panel was
  taller than the aspect-ratio height its top was clipped away — at 320px, and
  again at 640px where `sm:grid-cols-2` halves the column to 286px. Card
  titles and years disappeared entirely.

  At the two-column stage the six-column spans mean nothing, so the ratios are
  normalised there and only diverge again at `lg`.

  `w-full` is required, not cosmetic: with only a min-height and an
  aspect-ratio, the ratio resolves against the *height*, so a 352px min-height
  inflated each card to 469px wide and pushed the page into horizontal scroll
  at every width from 640 to 1280. A definite width makes the ratio derive
  height instead, and min-height then simply raises it.
*/
const spanClass: Record<Project["span"], string> = {
  wide: "w-full min-h-[22rem] sm:aspect-[4/3] lg:col-span-4 lg:aspect-[16/10]",
  tall: "w-full min-h-[22rem] sm:aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  unit: "w-full min-h-[22rem] sm:aspect-[4/3] lg:col-span-2",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group sq-lg relative block overflow-hidden ${spanClass[project.span]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.cover.src}
        /* Decorative: the link's own text already names the destination. A
           descriptive alt prefixed all six card links with the same eight
           words in the screen-reader links list. */
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />

      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <div className="glass-3 sq p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="t-title">{project.title}</h3>
            <span className="t-small tabular shrink-0">{project.year}</span>
          </div>
          <p className="t-small mt-2">{project.blurb}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="sq-full bg-ink/[0.06] px-2.5 py-1 text-xs text-ink-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectMosaic() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="measure">
        <h2 className="t-section">Things I built</h2>
        <p className="t-body mt-5">
          A detection model small enough to fly, a map of every road in a town,
          and an espresso machine that now argues back. They have very little in
          common, which is the most honest thing I can tell you about how I work.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
