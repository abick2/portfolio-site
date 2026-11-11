import ExternalLink from "@/components/ExternalLink";
import Section from "@/components/Section";
import { profile } from "@/data/profile";
import {
  roles,
  trackColor,
  trackLabel,
  type Role,
  type Track,
} from "@/data/experience";

/**
 * Work history as a route down one line: defense left, commercial right. Each
 * row paints its own segment; a crossing row fades through `--color-bridge`.
 */

// Marker and stub both hang off these offsets, so the marker sits on the line.
const MARKER_TOP = 30;
const STUB_TOP = 43;

function lineBackground(role: Role, crossing: boolean): string {
  if (!crossing) return trackColor(role.track);
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
        {trackLabel[track]}
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
    <div className="relative order-first lg:order-none" aria-hidden="true">
      <div
        className="absolute left-1/2 w-[2px] -translate-x-1/2"
        style={{
          top: 0,
          ...(last ? { height: STUB_TOP } : { bottom: 0 }),
          background: lineBackground(role, crossing),
        }}
      />
      <div
        className={`absolute hidden h-[2px] lg:block ${left ? "right-1/2 left-0" : "right-0 left-1/2"}`}
        style={{ top: STUB_TOP, background: color }}
      />
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
            {trackLabel[track]}
          </span>
        ))}
      </div>

      <ol className="mt-4">
        {roles.map((role, i) => (
          <Stop
            key={role.id}
            role={role}
            crossing={i > 0 && roles[i - 1].track !== role.track}
            last={i === roles.length - 1}
          />
        ))}
      </ol>
    </Section>
  );
}
