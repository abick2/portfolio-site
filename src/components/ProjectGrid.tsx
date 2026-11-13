import Link from "next/link";
import Frame from "@/components/Frame";
import Section from "@/components/Section";
import { projects } from "@/data/projects";

/**
 * Identical 4:3 frames. Covers anchor to the top. A project with a link is a
 * live site, so its cover is a screenshot and hangs in a window; the rest
 * share the window's corners so the grid reads as one set.
 */
export default function ProjectGrid() {
  return (
    <Section id="work" title="Featured Projects">
      <ul className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <Frame
                src={project.cover.src}
                alt=""
                position={project.cover.position}
                anchor="object-top"
                corners="window"
                windowBar={Boolean(project.links?.length)}
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
