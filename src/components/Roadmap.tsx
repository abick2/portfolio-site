import ExternalLink from "@/components/ExternalLink";
import Section from "@/components/Section";
import { profile } from "@/data/profile";
import { roles, trackColor, trackMeta, type Role, type Track } from "@/data/experience";

/**
 * Work history as a route down one line.
 *
 * The route is NRO, Deloitte, IBM, NRO — it crosses between the two worlds
 * twice and ends where it started with a different job. Sorting by date would
 * hide that, which is why `roles` is hand-ordered and nothing here sorts it.
 * Defense hangs left of the line, commercial right.
 *
 * Each row paints its own segment of the line edge to edge, so the line is
 * continuous. A crossing row paints a gradient through `--color-bridge`: the
 * change of world is a change in the line, not a label about it.
 */

/* The offset every row's furniture hangs off: the stub and the marker are
   positioned against it, so the marker sits on the line rather than near it. */
const MARKER_TOP = 30;
const STUB_TOP = 43;

function lineBackground(role: Role, crossing: boolean): string {
  if (!crossing) return trackColor(role.track);
  // Runs in the direction of travel; `bridge` sits slightly past halfway,
  // because the eye reads the arriving colour as the point of the row.
  return role.track === "commercial"
    ? "linear-gradient(to bottom, var(--color-defense), var(--color-bridge) 45%, var(--color-commercial))"
    : "linear-gradient(to bottom, var(--color-commercial), var(--color-bridge) 55%, var(--color-defense))";
}

function TrackHeader({ track, align }: { track: Track; align: "left" | "right" }) {
  const color = trackColor(track);
  return (
    <div className={align === "right" ? "pl-8 text-right" : "pr-8"}>
      <div
        aria-hidden="true"
        className="h-[2px] w-full"
        style={{ background: color }}
      />
      <h3 className="t-label mt-3" style={{ color }}>
        {trackMeta[track].label}
      </h3>
    </div>
  );
}

function Stop({
  role,
  crossing,
  last,
}: {
  role: Role;
  crossing: boolean;
  last: boolean;
}) {
  const color = trackColor(role.track);
  const left = role.track === "defense";

  const card = (
    <div
      className={`py-5 pl-5 lg:py-6 ${left ? "lg:pr-8 lg:pl-0 lg:text-right" : "lg:pr-0 lg:pl-8"}`}
    >
      <h3 className="t-section text-[clamp(1.5rem,2.2vw,2rem)]">{role.org}</h3>
      <p className="t-title mt-1.5" style={{ color }}>
        {role.title}
      </p>
      <p className="t-small tabular mt-1">{role.period}</p>
    </div>
  );

  const empty = <div className="hidden lg:block" aria-hidden="true" />;

  const line = (
    /* `order-first` below the breakpoint pulls the line to the left of every
       card, so the single column reads as one line with stops hanging off it
       rather than a zigzag. */
    <div className="relative order-first lg:order-none" aria-hidden="true">
      <div
        className="absolute left-1/2 w-[2px] -translate-x-1/2"
        style={{
          top: 0,
          // The last segment stops at its own marker — the route ends here.
          ...(last ? { height: STUB_TOP } : { bottom: 0 }),
          background: lineBackground(role, crossing),
        }}
      />
      <div
        className={`absolute hidden h-[2px] lg:block ${left ? "right-1/2 left-0" : "right-0 left-1/2"}`}
        style={{ top: STUB_TOP, background: color }}
      />
      {/* The wall-coloured ring is what makes the marker read as sitting ON
          the line rather than being a gap in it. */}
      <div
        className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2"
        style={{
          top: MARKER_TOP + 7,
          background: color,
          boxShadow: "0 0 0 4px var(--color-wall)",
        }}
      />
    </div>
  );

  return (
    <li className="grid grid-cols-[28px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
      {left ? card : empty}
      {line}
      {left ? empty : card}
    </li>
  );
}

export default function Roadmap() {
  return (
    <Section
      id="career"
      title="Work experience"
      aside={
        <ExternalLink href={profile.links.linkedin} className="link">
          Full history on LinkedIn
        </ExternalLink>
      }
    >
      <div className="hidden grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] lg:grid">
        <TrackHeader track="defense" align="left" />
        <div aria-hidden="true" />
        <TrackHeader track="commercial" align="right" />
      </div>

      {/* Below the breakpoint the two headers become a legend: left and right
          headers over a single column would assert a mapping it no longer has. */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 lg:hidden">
        {(["defense", "commercial"] as const).map((track) => (
          <span
            key={track}
            className="t-label flex items-center gap-2"
            style={{ color: trackColor(track) }}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5"
              style={{ background: trackColor(track) }}
            />
            {trackMeta[track].label}
          </span>
        ))}
      </div>

      <ol className="mt-4">
        {roles.map((role, i) => (
          <Stop
            key={role.id}
            role={role}
            /* Derived, not stored: a stop is a crossing when it lands in a
               different world than the one before it. */
            crossing={i > 0 && roles[i - 1].track !== role.track}
            last={i === roles.length - 1}
          />
        ))}
      </ol>
    </Section>
  );
}
