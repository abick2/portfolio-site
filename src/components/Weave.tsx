import { Fragment } from "react";
import { roles, trackMeta, type Role } from "@/data/experience";

/**
 * Experience, drawn as two parallel tracks with the crossings made explicit.
 *
 * The layout is the argument: a single tagged timeline would list the same
 * roles, but only a two-column form shows that the career moves *between* two
 * worlds rather than progressing through one. The `bridge` entries are the
 * payload — they are the moments being claimed, so they get the full width and
 * the gradient that runs from one track's colour to the other's.
 *
 * On narrow screens the columns collapse to one, and track membership is
 * carried by a colour rule down the left edge instead.
 */

function RoleCard({ role }: { role: Role }) {
  const accent =
    role.track === "defense" ? "var(--color-defense)" : "var(--color-commercial)";

  return (
    <article
      className="glass-2 sq-lg h-full border-l-2 p-6 sm:p-7"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="t-title">{role.org}</h3>
        <span className="t-small tabular shrink-0">{role.period}</span>
      </div>

      <p className="mt-1 text-[0.95rem]" style={{ color: accent }}>
        {role.title}
      </p>

      <p className="t-body measure mt-4">{role.summary}</p>

      <ul className="mt-5 space-y-2">
        {role.highlights.map((h) => (
          <li key={h} className="t-small flex gap-3">
            <span
              aria-hidden="true"
              className="mt-[0.55em] h-[3px] w-3 shrink-0 rounded-full"
              style={{ backgroundColor: accent, opacity: 0.55 }}
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Crossing({ label, toward }: { label: string; toward: Role["track"] }) {
  // The gradient runs in the direction of travel, so the eye moves the same way
  // the career did.
  const gradient =
    toward === "commercial"
      ? "linear-gradient(to right, var(--color-defense), var(--color-bridge), var(--color-commercial))"
      : "linear-gradient(to left, var(--color-defense), var(--color-bridge), var(--color-commercial))";

  return (
    <div className="my-2 flex items-center gap-3 py-3 sm:gap-4">
      <div
        aria-hidden="true"
        className="h-px flex-1"
        style={{ background: gradient }}
      />
      {/* `shrink-0` held this at its 338px intrinsic width, pushing the home
          page to scrollWidth 370 inside a 320px viewport — which is also a
          low-vision user at 400% zoom. Let it wrap instead. */}
      <p
        className="t-small min-w-0 text-center"
        style={{ color: "var(--color-bridge)" }}
      >
        {label}
      </p>
      <div
        aria-hidden="true"
        className="h-px flex-1"
        style={{ background: gradient }}
      />
    </div>
  );
}

export default function Weave() {
  const ordered = [...roles].sort((a, b) => b.start - a.start);

  /*
    Roles are grouped into segments, split after each role that carries a
    `bridge`. Each segment renders as its own two-column grid, so consecutive
    roles in the same track stack inside that track's column.

    The previous version placed every role with `md:col-start-*` and let auto
    flow assign rows. That gave each role its own row with the opposite column
    empty — the section read as an alternating zigzag list, which is precisely
    what a two-track layout exists to avoid.
  */
  const segments: { roles: Role[]; crossing: string | null }[] = [];
  let current: Role[] = [];
  for (const role of ordered) {
    current.push(role);
    if (role.bridge) {
      segments.push({ roles: current, crossing: role.bridge.label });
      current = [];
    }
  }
  if (current.length) segments.push({ roles: current, crossing: null });

  return (
    <section id="work" className="shell py-24 sm:py-32">
      <div className="measure">
        <h2 className="t-section">Two worlds, one career</h2>
        <p className="t-body mt-5">
          The useful part is not either column on its own. It is having spent long
          enough in both that I can carry something from one into the other without it
          getting lost in translation.
        </p>
      </div>

      {/* Column headers — hidden on mobile, where the layout is a single list. */}
      <div className="mt-14 hidden grid-cols-2 gap-6 md:grid lg:gap-10">
        {(["defense", "commercial"] as const).map((track) => (
          <div key={track} className="px-1">
            <div
              aria-hidden="true"
              className="sq-full mb-4 h-[3px] w-full"
              style={{
                backgroundColor:
                  track === "defense"
                    ? "var(--color-defense)"
                    : "var(--color-commercial)",
              }}
            />
            <h3
              className="t-title"
              style={{
                color:
                  track === "defense"
                    ? "var(--color-defense)"
                    : "var(--color-commercial)",
              }}
            >
              {trackMeta[track].label}
            </h3>
            <p className="t-small measure-tight mt-2">{trackMeta[track].blurb}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {segments.map((segment, i) => (
          <Fragment key={segment.roles[0].id}>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-10">
              {(["defense", "commercial"] as const).map((track) => {
                const inTrack = segment.roles.filter((r) => r.track === track);
                if (inTrack.length === 0) {
                  // Keep the column slot occupied so the other track stays in
                  // its own column instead of sliding across.
                  return (
                    <div key={track} className="hidden md:block" aria-hidden="true" />
                  );
                }
                return (
                  <div key={track} className="flex flex-col gap-6">
                    {inTrack.map((role) => (
                      <RoleCard key={role.id} role={role} />
                    ))}
                  </div>
                );
              })}
            </div>
            {segment.crossing && (
              <Crossing
                label={segment.crossing}
                toward={segment.roles[segment.roles.length - 1].track}
              />
            )}
            {!segment.crossing && i < segments.length - 1 && <div className="h-6" />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
