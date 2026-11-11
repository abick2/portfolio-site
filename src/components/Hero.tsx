import { profile } from "@/data/profile";

/**
 * The title wall: the name, and one photograph hung beside it with its label.
 *
 * No tagline and no buttons. The scroll is the way in, and everything below
 * this is the argument a one-liner would otherwise try to make.
 *
 * The name is composited through the fluid simulation (`.knockout`), so
 * NOTHING between it and the canvas may create a stacking context: no
 * z-index, transform, filter, or sticky/fixed position on this section or the
 * heading. See the knockout note in globals.css.
 */

const PORTRAIT = "/images/portrait/profile_pic.jpg";

export default function Hero() {
  // Split from `profile.name` rather than retyped, so a rename reaches the
  // hero, the nav and the <title> together.
  const [firstWord, ...restWords] = profile.name.split(" ");
  const lastWord = restWords.join(" ");

  return (
    <section
      id="top"
      className="page grid min-h-[calc(100svh-4rem)] grid-cols-1 content-end gap-x-[var(--spacing-gutter)] gap-y-10 pt-10 pb-12 lg:grid-cols-12 lg:items-end lg:pt-6"
    >
      {/* One `<h1>`, so the heading's accessible name is the whole name. */}
      <h1 className="t-hero lg:col-span-7 lg:pb-[3.25rem]">
        <span className="knockout block">{firstWord}</span>
        <span className="knockout block">{lastWord}</span>
      </h1>

      <figure className="w-full lg:col-span-5 lg:ml-auto lg:max-w-[calc((100svh-11rem)*0.8)]">
        <div className="aspect-[4/5] w-full overflow-hidden bg-frame">
          <img
            src={PORTRAIT}
            alt={`Portrait of ${profile.name}`}
            fetchPriority="high"
            /* Crop dial: swap `object-center` for e.g. `object-[50%_25%]`
               to raise the crop. */
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
