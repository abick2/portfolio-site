import Link from "next/link";
import Frame from "@/components/Frame";
import Section from "@/components/Section";
import { playAreas } from "@/data/play";

/**
 * The hobbies, hung two to a row at a larger size than the projects — this is
 * the part of the site its owner most wants seen.
 *
 * One photograph and one figure each. The galleries, tables and maps belong
 * on /play/<slug>; the home page only invites.
 */
export default function PlayGrid() {
  return (
    <Section id="play" title="Get to know me better">
      <ul className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-14 md:grid-cols-2">
        {playAreas.map((area) => {
          const cover = area.gallery[0];
          return (
            <li key={area.slug}>
              <Link href={`/play/${area.slug}`} className="group block">
                <Frame
                  src={cover?.src}
                  alt={cover?.alt ?? ""}
                  position={cover?.position}
                />
                <div className="mt-4 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="t-title underline-offset-[0.22em] group-hover:underline group-focus-visible:underline">
                      {area.title}
                    </h3>
                    <p className="t-small mt-1 max-w-[40ch]">{area.heading}</p>
                  </div>
                  {/* The figure sits in the same corner of every label, so the
                      four of them read across as one set of numbers. */}
                  <div className="shrink-0 text-right">
                    <p className="t-figure">{area.evidence.value}</p>
                    <p className="t-small mt-1">{area.evidence.label}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
