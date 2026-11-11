import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ExternalLink, { ArrowOut } from "@/components/ExternalLink";
import Frame, { isPhoto } from "@/components/Frame";
import { projects, projectBySlug } from "@/data/projects";

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

  // For live sites the cover is a screenshot, so it links to the site itself.
  const live = project.links?.[0];
  const liveHost = live ? new URL(live.href).host.replace(/^www\./, "") : null;
  const image = project.coverWide ?? project.cover;
  const cover = (
    <Frame
      src={image.src}
      alt={image.alt}
      position={image.position}
      ratio="aspect-[16/9]"
      anchor="object-top"
      eager
    />
  );
  const photos = project.gallery.filter((g) => isPhoto(g.src));

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
          {cover}
          <p className="t-label mt-3 group-hover:underline">
            {liveHost}
            <ArrowOut />
          </p>
        </ExternalLink>
      ) : (
        <div className="mt-10">{cover}</div>
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

      {photos.length > 0 && (
        <div className="mt-20 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-10 sm:grid-cols-2">
          {photos.map((photo) => (
            <figure key={photo.src}>
              <Frame src={photo.src} alt={photo.alt} position={photo.position} />
              {photo.caption && (
                <figcaption className="t-small mt-3">{photo.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}
