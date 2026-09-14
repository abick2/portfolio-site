import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectBySlug } from "@/data/projects";

/** Static export needs every route enumerated at build time. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return { title: `${project.title} — Andrew Bickford`, description: project.blurb };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <Link
        href="/#work"
        className="t-small inline-flex min-h-11 items-center hover:text-ink"
      >
        Back to projects
      </Link>

      <header className="mt-8 max-w-4xl">
        <h1 className="t-display">{project.title}</h1>
        <p className="t-lead measure mt-5">{project.blurb}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="sq-full bg-ink/[0.06] px-3 py-1 text-sm text-ink-soft tabular">
            {project.year}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="sq-full bg-ink/[0.06] px-3 py-1 text-sm text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="photo-lift sq-xl mt-12 aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-14 space-y-6">
        {project.body.map((para) => (
          <p key={para.slice(0, 40)} className="t-body measure text-[1.125rem]">
            {para}
          </p>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="sq-full bg-ink px-6 py-3 text-paper transition-transform duration-200 hover:scale-[1.03]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {project.gallery.length > 0 && (
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {project.gallery.map((image) => (
            <figure key={image.src}>
              <div className="photo-lift sq-lg aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              {image.caption && (
                <figcaption className="t-small mt-3">{image.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/*
        Returns to the mosaic rather than chaining to the next project. The six
        of them have almost nothing in common, so "next" was an arbitrary
        ordering presented as a sequence — and it kept readers walking sideways
        through the list instead of back to the page that put it in context.
      */}
      <nav className="mt-24 border-t border-ink/10 pt-8" aria-label="Back to projects">
        <Link href="/#work" className="group block">
          <p className="t-small">Back to</p>
          <h2 className="t-section mt-2 transition-transform duration-300 group-hover:translate-x-2">
            Everything I built
          </h2>
        </Link>
      </nav>
    </article>
  );
}
