import Link from "next/link";
import Frame from "@/components/Frame";
import Section from "@/components/Section";
import { projects } from "@/data/projects";

/**
 * Projects, hung in a row of identical frames.
 *
 * Every card is the same 4:3 box with its label underneath — title and year on
 * one line, then one line on what it is. The previous mosaic mixed square,
 * tall and wide cards, which made the composition depend on array order and
 * made some projects look more important than others for no reason.
 *
 * Covers anchor to the top: three of them are screenshots of live sites, and
 * a crop from the middle throws away the header that identifies the page.
 */
export default function ProjectGrid() {
  return (
    <Section id="work" title="Featured Projects">
      <ul className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              {/* Decorative alt: the link's own text names the destination. */}
              <Frame
                src={project.cover.src}
                alt=""
                position={project.cover.position}
                anchor="object-top"
              />
              <div className="mt-3.5 flex items-baseline justify-between gap-4">
                <h3 className="t-title underline-offset-[0.22em] group-hover:underline group-focus-visible:underline">
                  {project.title}
                </h3>
                <span className="t-small tabular shrink-0">{project.year}</span>
              </div>
              <p className="t-small mt-1 max-w-[46ch]">{project.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
