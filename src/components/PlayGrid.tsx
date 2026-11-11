import Link from "next/link";
import Frame from "@/components/Frame";
import Section from "@/components/Section";
import { playAreas } from "@/data/play";
import { profile } from "@/data/profile";

/** The personal intro, then one photograph and one figure per hobby. Detail lives on /play/<slug>. */
export default function PlayGrid() {
  return (
    <Section id="play" title="Get to know me better">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-[var(--spacing-gutter)]">
        <div className="space-y-4 lg:col-span-7 lg:col-start-5">
          {profile.about.map((para) => (
            <p key={para.slice(0, 40)} className="t-lead measure">
              {para}
            </p>
          ))}
        </div>
      </div>

      <ul className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-14 md:grid-cols-2">
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
