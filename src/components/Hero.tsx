import { profile } from "@/data/profile";

const PORTRAIT = "/images/portrait/profile_pic.jpg";

/**
 * The name beside the portrait. The name is composited through the fluid
 * (`.knockout`), so nothing here may create a stacking context: no z-index,
 * transform, filter, or sticky/fixed position on this section or the heading.
 */
export default function Hero() {
  const [firstWord, ...restWords] = profile.name.split(" ");
  const lastWord = restWords.join(" ");

  return (
    <section
      id="top"
      className="page grid min-h-[calc(100svh-4rem)] grid-cols-1 content-end gap-x-[var(--spacing-gutter)] gap-y-10 pt-10 pb-12 lg:grid-cols-12 lg:items-end lg:pt-6"
    >
      <h1 className="t-hero lg:col-span-7 lg:pb-[3.25rem]">
        <span className="knockout block">{firstWord}</span>
        <span className="knockout block">{lastWord}</span>
      </h1>

      <figure className="w-full lg:col-span-5 lg:ml-auto lg:max-w-[calc((100svh-11rem)*0.8)]">
        <div className="squircle-4x5 aspect-[4/5] w-full overflow-hidden bg-frame">
          <img
            src={PORTRAIT}
            alt={`Portrait of ${profile.name}`}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="t-label">{profile.name}</span>
          <span className="t-small">{profile.role}</span>
        </figcaption>
      </figure>
    </section>
  );
}
