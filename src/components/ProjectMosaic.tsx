import Link from "next/link";
import { projects, type Project } from "@/data/projects";

/**
 * Projects as a hand-composed mosaic rather than a uniform card grid.
 *
 * Sizes come from each project's `span`, and the six of them are arranged so
 * the rows resolve exactly against a six-column grid:
 *
 *   row 1   [ wide  4 ][ unit 2 ]
 *   row 2   [ unit 2 ][ unit 2 ][ tall 2 ]
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
  taller than the aspect-ratio height its top was clipped away — card titles and
  years disappeared entirely.

  `w-full` is required, not cosmetic: with only a min-height and an
  aspect-ratio, the ratio resolves against the *height*, so a 352px min-height
  inflated each card to 469px wide and pushed the page into horizontal scroll at
  every width from 640 to 1280. A definite width makes the ratio derive height
  instead, and min-height then simply raises it.

  Below the breakpoint every card is one column at the same ratio: the
  six-column spans mean nothing there, and a card that is "wide" relative to
  nothing is just a card.
*/
const spanClass: Record<Project["span"], string> = {
  wide: "w-full aspect-[4/3] min-h-[20rem] wide:col-span-4 wide:aspect-[16/10] wide:min-h-[22rem]",
  tall: "w-full aspect-[4/3] min-h-[20rem] wide:col-span-2 wide:row-span-2 wide:aspect-auto wide:min-h-[22rem]",
  unit: "w-full aspect-[4/3] min-h-[20rem] wide:col-span-2 wide:min-h-[22rem]",
};

function ProjectCard({ project }: { project: Project }) {
  const big = project.span === "wide";

  return (
    /*
      The hover moves the whole card, and moves it a long way: -14px and a
      shadow that reaches 90px. The previous version scaled the image inside a
      static frame, which was too quiet to read as "this is clickable" — six
      photographs in a grid look like a gallery until one of them lifts.
    */
    <Link
      href={`/projects/${project.slug}`}
      className={`photo-lift sq-lg relative block overflow-hidden transition-[translate,scale,box-shadow] duration-[340ms] ease-[cubic-bezier(0.16,1,0.3,1)] lift-xl hover:-translate-y-3.5 hover:scale-[1.015] ${spanClass[project.span]}`}
    >
      <img
        src={project.cover.src}
        /* Decorative: the link's own text already names the destination. A
           descriptive alt prefixed all six card links with the same eight
           words in the screen-reader links list. */
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Title, year, one line. The tag chips moved to the detail page — six
          cards each carrying four chips turned the mosaic into a tag cloud. */}
      <div className={`absolute right-0 bottom-0 left-0 ${big ? "m-4" : "m-3.5"}`}>
        <div className={`glass-3 sq ${big ? "p-5" : "p-[18px]"}`}>
          <div className="flex items-baseline justify-between gap-4">
            {/* Inline font-size on the small cards: `.t-title` is unlayered CSS
                and beats any Tailwind utility regardless of specificity. */}
            <h3 className="t-title" style={big ? undefined : { fontSize: "1.25rem" }}>
              {project.title}
            </h3>
            <span className="t-small tabular shrink-0">{project.year}</span>
          </div>
          <p className="t-small mt-2">{project.blurb}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectMosaic() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-[14vh]">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="t-section">Things I built</h2>
        <p className="t-small">Click each to learn more.</p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 wide:grid-cols-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
