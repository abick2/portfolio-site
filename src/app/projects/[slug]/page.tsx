import Link from "next/link";
import ExternalLink, { ArrowOut } from "@/components/ExternalLink";
import { isPhoto } from "@/components/Frame";
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

  /*
    For the projects that are live sites, the cover is a screenshot of that
    site's landing page — so the image is the most direct way in, and the
    first link on the project is where it goes. Projects with nothing to visit
    (the drone, the espresso machine) keep a plain frame.
  */
  const live = project.links?.[0];
  const liveHost = live ? new URL(live.href).host.replace(/^www\./, "") : null;

  /* `coverWide` where there is one — the grid card's cover is shaped for 4:3,
     and this frame is 16/9. */
  const image = project.coverWide ?? project.cover;

  const cover = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={image.src}
      alt={image.alt}
      /* Anchored to the top rather than the centre, so anything this frame
         does crop comes off the bottom — a screenshot is read from the top.
         `position` on the image overrides it. */
      className="h-full w-full object-cover object-top"
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  );

  return (
    <article className="page pt-10 pb-[clamp(5rem,10vw,9rem)] sm:pt-14">
      <Link href="/#work" className="t-label link inline-flex min-h-11 items-center">
        Back to projects
      </Link>

      <header className="mt-6 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-5 border-t border-ink/15 pt-6 lg:grid-cols-12">
        <h1 className="t-section lg:col-span-7">{project.title}</h1>
        <div className="lg:col-span-5">
          <p className="t-lead">{project.blurb}</p>
          <p className="t-small tabular mt-3">
            {project.year} · {project.tags.join(", ")}
          </p>
        </div>
      </header>

      {live ? (
        <ExternalLink
          href={live.href}
          aria-label={`Open ${liveHost}`}
          arrow={false}
          className="group mt-10 block"
        >
          <div className="aspect-[16/9] overflow-hidden bg-frame">{cover}</div>
          <p className="t-label mt-3 group-hover:underline">
            {liveHost}
            <ArrowOut />
          </p>
        </ExternalLink>
      ) : (
        <div className="mt-10 aspect-[16/9] overflow-hidden bg-frame">{cover}</div>
      )}

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-[var(--spacing-gutter)]">
        <div className="space-y-6 lg:col-span-7 lg:col-start-5">
          {project.body.map((para) => (
            <p key={para.slice(0, 40)} className="t-body measure text-[1.125rem]">
              {para}
            </p>
          ))}

          {project.links && project.links.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {project.links.map((link) => (
                <li key={link.label}>
                  <ExternalLink href={link.href} className="t-title link">
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Only real photographs. A grid of placeholder boxes on a page about the
          thing is just a page that failed. */}
      {project.gallery.some((image) => isPhoto(image.src)) && (
        <div className="mt-20 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-10 sm:grid-cols-2">
          {project.gallery
            .filter((image) => isPhoto(image.src))
            .map((image) => (
              <figure key={image.src}>
                <div className="aspect-[4/3] overflow-hidden bg-frame">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={
                      image.position ? { objectPosition: image.position } : undefined
                    }
                  />
                </div>
                {image.caption && (
                  <figcaption className="t-small mt-3">{image.caption}</figcaption>
                )}
              </figure>
            ))}
        </div>
      )}
    </article>
  );
}
