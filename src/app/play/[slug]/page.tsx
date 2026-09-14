import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { playAreas, playBySlug, type PlayArea } from "@/data/play";
import { running, triathlon, splits } from "@/data/athletics";
import { places } from "@/data/travel";
import WorldMap from "@/components/WorldMap";
import PRTable from "@/components/PRTable";

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

/**
 * The hobby's photographs, at a size worth looking at.
 *
 * A grid, not the home page's carousel: this page's whole job is the pictures,
 * and asking someone to swipe through them one at a time is the wrong shape
 * for that. The home row is a teaser and needs to stay one row tall; this does
 * not.
 *
 * Only frames that hold an actual photograph. Two kinds of frame do not:
 * `src: null`, which the home row deliberately keeps visible so the gap is
 * obvious to whoever fills it, and the generated gradient placeholders — every
 * file `scripts/make-placeholders.mjs` writes is an SVG, so the extension is a
 * reliable way to tell a stand-in from a photo. A grid of placeholder boxes on
 * a page about photographs is just a page that failed.
 */
function PlayGallery({ area }: { area: PlayArea }) {
  const photos = area.gallery.filter((f) => f.src && !f.src.endsWith(".svg"));
  if (photos.length === 0) return null;

  // One photo in a two-column grid is a photo and a hole. Give it the full
  // width and a wider frame instead.
  const solo = photos.length === 1;

  return (
    <section className="mt-14" aria-label={`${area.title} photos`}>
      <div className={`grid grid-cols-1 gap-5 ${solo ? "" : "sm:grid-cols-2"}`}>
        {photos.map((frame) => (
          <div
            key={frame.src}
            className={`photo-lift sq-lg overflow-hidden ${solo ? "aspect-[3/2]" : "aspect-[4/3]"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frame.src as string}
              alt={frame.alt}
              loading="lazy"
              className="h-full w-full object-cover"
              style={frame.position ? { objectPosition: frame.position } : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Each hobby page carries different evidence, so the body below the intro
 * branches by slug rather than trying to force one shared template over a map,
 * a set of race times, and a photo gallery.
 */
function PlayBody({ slug }: { slug: string }) {
  if (slug === "travel") {
    return (
      <div className="mt-14 space-y-12">
        <WorldMap />

        <div>
          <h2 className="t-section">Every pin</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <li key={place.id} className="glass-1 sq p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[1.05rem]">{place.city}</h3>
                  <span className="t-small tabular">{place.year}</span>
                </div>
                <p className="t-small mt-1">{place.country}</p>
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

  return (
    <div className="glass-2 sq-lg mt-14 p-8">
      <p className="t-body measure">
        Placeholder. This page is waiting on photos and a few paragraphs about
        restaurant week and cooking at home.
      </p>
    </div>
  );
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
    <article className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
      <Link
        href="/#play"
        className="t-small inline-flex min-h-11 items-center hover:text-ink"
      >
        Back to the rest of it
      </Link>

      <header className="mt-8 max-w-4xl">
        <h1 className="t-display">{area.title}</h1>
        <p className="t-lead measure mt-5">{area.blurb}</p>
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
