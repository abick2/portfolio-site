import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Frame, { isPhoto } from "@/components/Frame";
import PRTable from "@/components/PRTable";
import WorldMap from "@/components/WorldMap";
import { running, splits, triathlon } from "@/data/athletics";
import { playAreas, playBySlug, type PlayArea } from "@/data/play";
import { countries } from "@/data/travel";

export function generateStaticParams() {
  return playAreas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = playBySlug(slug);
  if (!area) return {};
  return { title: `${area.title} — Andrew Bickford`, description: area.blurb };
}

/** Real photographs only. A single photo gets the full width at 16:9. */
function PlayGallery({ area }: { area: PlayArea }) {
  const photos = area.gallery.filter((f) => isPhoto(f.src));
  if (photos.length === 0) return null;
  const solo = photos.length === 1;

  return (
    <section
      className={`mt-14 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-10 ${solo ? "" : "sm:grid-cols-2"}`}
      aria-label={`${area.title} photos`}
    >
      {photos.map((frame) => (
        <Frame
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          position={frame.position}
          ratio={solo ? "aspect-[16/9]" : "aspect-[4/3]"}
        />
      ))}
    </section>
  );
}

/** Each hobby carries different evidence: a map, race times, or nothing yet. */
function PlayBody({ slug }: { slug: string }) {
  if (slug === "travel") {
    return (
      <div className="mt-14 space-y-12">
        <WorldMap />
        <div>
          <h2 className="t-section">Every country</h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...countries]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((country) => (
                <li key={country.id} className="border-t border-ink/15 pt-3">
                  <h3 className="t-title">{country.name}</h3>
                  {country.note && <p className="t-small mt-1">{country.note}</p>}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  if (slug === "triathlon") {
    return (
      <div className="mt-14 space-y-14">
        <PRTable title="Race bests" records={triathlon} />
        <PRTable title="Discipline bests" records={splits} />
      </div>
    );
  }

  if (slug === "running") {
    return (
      <div className="mt-14">
        <PRTable title="Personal records" records={running} />
      </div>
    );
  }

  return null;
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = playBySlug(slug);
  if (!area) notFound();

  return (
    <article className="page pt-10 pb-[clamp(5rem,10vw,9rem)] sm:pt-14">
      <Link href="/#play" className="t-label link inline-flex min-h-11 items-center">
        Back to the rest of it
      </Link>

      <header className="mt-6 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-5 border-t border-ink/15 pt-6 lg:grid-cols-12">
        <h1 className="t-section lg:col-span-7">{area.title}</h1>
        <p className="t-lead lg:col-span-5">{area.blurb}</p>
      </header>

      <div className="mt-10 space-y-5">
        {area.body.map((para) => (
          <p key={para.slice(0, 40)} className="t-body measure">
            {para}
          </p>
        ))}
      </div>

      <PlayGallery area={area} />
      <PlayBody slug={slug} />
    </article>
  );
}
