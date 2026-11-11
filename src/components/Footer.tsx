import ExternalLink from "@/components/ExternalLink";
import { profile } from "@/data/profile";

const social = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Strava", href: profile.links.strava },
];

/**
 * One compact band: the invitation on the left, the ways to reach me on the
 * right, the credit underneath. The previous footer was a full glass panel
 * with a display-size heading, which made the end of every page taller than
 * most of its sections.
 */
export default function Footer() {
  return (
    <footer className="page pb-8">
      <div className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-6 border-t border-ink pt-6 md:grid-cols-12">
        <h2 className="t-section md:col-span-5">Let's talk.</h2>

        <div className="md:col-span-7 md:pt-1">
          {/* Same tab: a `_blank` mailto leaves an empty tab behind. Wraps
              anywhere because the address is one long token that would
              otherwise set the minimum width of the page. */}
          <a
            href={`mailto:${profile.links.email}`}
            className="t-title link [overflow-wrap:anywhere]"
          >
            {profile.links.email}
          </a>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {social.map((link) => (
              <li key={link.label}>
                <ExternalLink
                  href={link.href}
                  className="t-label inline-flex min-h-11 items-center"
                >
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The WebGL-Fluid-Simulation credit is required by its MIT licence,
          not optional politeness. Do not drop it. */}
      <p className="t-small mt-8">
        Built by {profile.name}. The fluid effect is derived from Pavel Dobryakov's
        WebGL-Fluid-Simulation (MIT).
      </p>
    </footer>
  );
}
