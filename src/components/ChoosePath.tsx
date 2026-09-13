"use client";

const doors = [
  {
    id: "work",
    title: "Work experience",
    note: "Two worlds, one career — defense and commercial, and the crossings between them.",
    cta: "See the work",
  },
  {
    id: "fun",
    title: "The fun stuff",
    note: "Running, travel, triathlon, food — and the things I have built for no reason but wanting them.",
    cta: "See the rest",
  },
];

/** How long the arrival emphasis stays on the target section. */
const ARRIVED_MS = 1200;
/** Fallback for browsers with no `scrollend`, and a ceiling for slow scrolls. */
const SCROLL_TIMEOUT_MS = 1200;

/**
 * The fork in the page.
 *
 * It is a signpost, not a gate: both doors scroll you down this same page, and
 * a visitor who ignores it entirely still reaches everything by scrolling. A
 * real gate would let someone reading for the job quietly skip the half of the
 * site that makes the case for range — which is the argument the whole page is
 * making.
 *
 * The quiet rule-and-label heading is the same motif `Weave` uses for its track
 * crossings, which is the right borrowed idiom: this is a crossing too.
 */
export default function ChoosePath() {
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    // No target (or a modified click) — let the browser handle the anchor.
    if (!target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (const node of document.querySelectorAll("[data-arrived]")) {
      node.removeAttribute("data-arrived");
    }

    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // `replaceState` rather than pushing: the chooser is a shortcut, not a step
    // in the visitor's history, and a back button that only undoes a scroll is
    // a back button that does not work.
    history.replaceState(null, "", `#${id}`);

    if (reduced) return;

    let done = false;
    const arrive = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scrollend", arrive);
      target.setAttribute("data-arrived", "");
      window.setTimeout(() => target.removeAttribute("data-arrived"), ARRIVED_MS);
    };

    // `scrollend` lands the emphasis exactly when the scroll settles; the
    // timeout both covers browsers without it and stops a very long scroll from
    // leaving the animation pending forever.
    window.addEventListener("scrollend", arrive);
    window.setTimeout(arrive, SCROLL_TIMEOUT_MS);
  };

  return (
    <section id="choose" className="shell py-20 sm:py-24">
      <div className="flex items-center gap-4">
        <div aria-hidden="true" className="h-px flex-1 bg-ink/15" />
        <h2 className="t-small min-w-0 text-center">Choose your path</h2>
        <div aria-hidden="true" className="h-px flex-1 bg-ink/15" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {doors.map((door) => (
          <a
            key={door.id}
            href={`#${door.id}`}
            onClick={(e) => goTo(e, door.id)}
            className="group glass-2 sq-lg flex min-h-[14rem] flex-col justify-between gap-8 p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9"
          >
            <div>
              <h3 className="t-display leading-none">{door.title}</h3>
              <p className="t-small measure-tight mt-4">{door.note}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-[0.95rem]">
              {door.cta}
              <svg
                viewBox="0 0 24 12"
                aria-hidden="true"
                className="h-3 w-6 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M0 6 H22 M16 1 L22 6 L16 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
