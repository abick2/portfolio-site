import Link from "next/link";
import { playAreas } from "@/data/play";

/**
 * The hobby doorways.
 *
 * Each tile leads with a piece of evidence — a time, a count — set at display
 * size, because a number is a more interesting thing to meet than an icon and a
 * sentence. The first tile runs full width so the four do not read as one
 * component repeated four times.
 */
export default function PlayTiles() {
  const [lead, ...rest] = playAreas;

  return (
    <section id="play" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="measure">
        <h2 className="t-section">The rest of it</h2>
        <p className="t-body mt-5">
          The part I enjoy sharing most.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        <Link
          href={`/play/${lead.slug}`}
          /* min-h floor: at 320px the 16/9 box is 162px but the glass panel
             is 181px, so the top of the panel was clipped off. */
          className="group photo-lift sq-lg relative col-span-full block w-full min-h-[15rem] overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lead.cover.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
            <div className="glass-3 sq flex flex-wrap items-end justify-between gap-6 p-6">
              <div>
                <h3 className="t-title">{lead.title}</h3>
                <p className="t-small measure-tight mt-2">{lead.blurb}</p>
              </div>
              <p className="t-display tabular leading-none">{lead.evidence.value}</p>
            </div>
          </div>
        </Link>

        {rest.map((area) => (
          <Link
            key={area.slug}
            href={`/play/${area.slug}`}
            className="group glass-2 sq-lg flex flex-col justify-between gap-8 p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
          >
            <div>
              <h3 className="t-title">{area.title}</h3>
              <p className="t-small mt-2">{area.blurb}</p>
            </div>
            <div>
              <p className="t-display tabular leading-none">{area.evidence.value}</p>
              <p className="t-small mt-2">{area.evidence.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
