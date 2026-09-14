import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { playAreas, playBySlug } from "@/data/play";
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

      <PlayBody slug={slug} />
    </article>
  );
}
