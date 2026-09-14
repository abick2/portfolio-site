import DeeperLink from "@/components/DeeperLink";
import { profile } from "@/data/profile";
import { roles, trackColor, trackMeta, type Role, type Track } from "@/data/experience";

/**
 * Work history as a numbered route down a single spine.
 *
 * This replaces the two-column weave. The weave showed that the career has two
 * tracks; the roadmap shows the *order* it visited them, which is the more
 * interesting fact — the route is NRO, Deloitte, IBM, NRO, so it crosses the
 * middle twice and ends up back where it started with a different job. Sorting
 * by date would hide that entirely, which is why `roles` is hand-ordered and
 * nothing here sorts it.
 *
 * The spine is continuous across rows because every row paints its own segment
 * edge-to-edge in its own centre cell. Crossing rows paint a gradient through
 * `--color-bridge` instead of a flat colour, so the change of world is a change
 * in the line rather than a label about it.
 *
 * Cards carry no summary and no bullets. The single "Go deeper" pill at the
 * foot of the section stands in for all of that — four cards of prose here is
 * the resume this site exists not to be.
 */

/* The offset every row's furniture hangs off: the connector stub and the top of
   the marker are positioned against it, so the dot sits on the line rather than
   near it. Changing it means changing all three. */
const MARKER_TOP = 36;
const STUB_TOP = 52;

function spineBackground(role: Role, crossing: boolean): string {
  if (!crossing) return trackColor(role.track);

  // The gradient runs in the direction of travel, and `bridge` sits at the
  // moment of crossing — slightly past halfway, because the eye reads the
  // arriving colour as the point of the row.
  return role.track === "commercial"
    ? "linear-gradient(to bottom, var(--color-defense), var(--color-bridge) 45%, var(--color-commercial))"
    : "linear-gradient(to bottom, var(--color-commercial), var(--color-bridge) 55%, var(--color-defense))";
}

function TrackHeader({
  track,
  align = "left",
}: {
  track: Track;
  align?: "left" | "right";
}) {
  const color = trackColor(track);
  return (
    <div className={align === "right" ? "pl-6" : "pr-6"}>
      <div
        aria-hidden="true"
        className="sq-full h-[3px] w-full"
        style={{ background: color }}
      />
      {/* Inline font-size: `.t-title` is unlayered CSS and beats any Tailwind
          utility regardless of specificity. See the note in Nav.tsx. */}
      <h3
        className={`t-title mt-3.5 ${align === "right" ? "text-right" : ""}`}
        style={{ fontSize: "1.2rem", color }}
      >
        {trackMeta[track].label}
      </h3>
    </div>
  );
}

function Stop({
  role,
  index,
  crossing,
  last,
}: {
  role: Role;
  index: number;
  crossing: boolean;
  last: boolean;
}) {
  const color = trackColor(role.track);
  // Track does double duty: it picks the colour and the side, matching the two
  // column headers above. Defense reads left, commercial reads right.
  const left = role.track === "defense";

  const card = (
    <div
      className={`py-[18px] pl-[18px] wide:py-7 ${
        left ? "wide:pr-6 wide:pl-0" : "wide:pr-0 wide:pl-6"
      }`}
    >
      {/*
        TODO: an `<article>`, not a link, because the work-experience detail
        page does not exist yet — the design's cards are anchors. The hover lift
        is kept per the design spec; wrap this in a <Link> the moment there is
        somewhere for it to go.
      */}
      <article
        className="glass-2 sq-lg block p-6 transition-[translate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lift-lg hover:-translate-y-2"
        style={
          left
            ? { borderLeft: `3px solid ${color}` }
            : { borderRight: `3px solid ${color}` }
        }
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="t-title">{role.org}</h3>
            <p className="mt-1.5 text-[0.95rem]" style={{ color }}>
              {role.title}
            </p>
          </div>
          <p className="t-small tabular mt-1 flex-none">{role.period}</p>
        </div>
      </article>
    </div>
  );

  const empty = <div className="hidden wide:block" aria-hidden="true" />;

  const spine = (
    /*
      `order-first` below the breakpoint pulls the spine to the left of the card
      whichever side the card was on, so the single-column layout reads as one
      line with four stops hanging off it rather than a zigzag.
    */
    <div className="relative order-first wide:order-none" aria-hidden="true">
      <div
        className="absolute left-1/2 w-[3px] -translate-x-1/2"
        style={{
          top: 0,
          // The last segment stops at its own marker instead of running off
          // the bottom of the section — the route ends here.
          ...(last ? { height: STUB_TOP } : { bottom: 0 }),
          background: spineBackground(role, crossing),
        }}
      />

      {/* Spine to card. Hidden in the single-column layout, where there is no
          gap left to bridge. */}
      <div
        className={`absolute hidden h-[3px] wide:block ${
          left ? "right-1/2 -left-[18px]" : "left-1/2 -right-[18px]"
        }`}
        style={{ top: STUB_TOP, background: color }}
      />

      {/* The paper ring is what makes the marker read as sitting ON the line
          rather than being a gap in it. */}
      <div
        className="sq-full tabular absolute left-1/2 grid h-7 w-7 -translate-x-1/2 place-items-center text-[0.72rem] font-semibold shadow-[0_0_0_3px_var(--color-paper)] wide:h-[34px] wide:w-[34px] wide:text-[0.8rem] wide:shadow-[0_0_0_4px_var(--color-paper)]"
        style={{
          top: MARKER_TOP,
          background: color,
          color: "var(--color-paper)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] items-stretch wide:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)]">
      {left ? card : empty}
      {spine}
      {left ? empty : card}
    </div>
  );
}

export default function Roadmap() {
  return (
    <section id="career" className="mx-auto max-w-6xl px-6 pb-[14vh]">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="t-section">Work experience</h2>
        <p className="t-small">Two worlds</p>
      </div>

      {/* One header per column, with the spine gutter empty between them. */}
      <div className="mt-10 hidden grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] items-start wide:grid">
        <TrackHeader track="defense" />
        <div aria-hidden="true" />
        <TrackHeader track="commercial" align="right" />
      </div>

      {/*
        Below the breakpoint the two headers are replaced by a dot legend. They
        are not just hidden: left and right headers standing above a single
        column would assert a mapping the layout no longer has.
      */}
      <div className="mt-7 flex flex-wrap gap-5 wide:hidden">
        {(["defense", "commercial"] as const).map((track) => (
          <span
            key={track}
            className="t-small flex items-center gap-2"
            style={{ color: trackColor(track) }}
          >
            <span
              aria-hidden="true"
              className="sq-full h-2.5 w-2.5"
              style={{ background: trackColor(track) }}
            />
            {trackMeta[track].label}
          </span>
        ))}
      </div>

      <div className="mt-2">
        {roles.map((role, i) => (
          <Stop
            key={role.id}
            role={role}
            index={i}
            /* Derived, not stored. A stop is a crossing when it lands in a
               different world than the one before it — so the gradient can
               never disagree with the route. */
            crossing={i > 0 && roles[i - 1].track !== role.track}
            last={i === roles.length - 1}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        {/* TODO: the design leaves this destination open — there is no
            work-experience page yet. LinkedIn is the honest stand-in: it is
            the one place that genuinely goes deeper on this section today. */}
        <DeeperLink
          href={profile.links.linkedin}
          label="Go deeper on work experience"
        />
      </div>
    </section>
  );
}
