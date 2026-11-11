import ExternalLink from "@/components/ExternalLink";
import { profile } from "@/data/profile";

const social = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Strava", href: profile.links.strava },
];

export default function Footer() {
  return (
    <footer className="page pb-8">
      <div className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-6 border-t border-ink pt-6 md:grid-cols-12">
        <h2 className="t-section md:col-span-5">Let's talk.</h2>

        <div className="md:col-span-7 md:pt-1">
          {/* Same tab on purpose; wraps anywhere so the address cannot widen the page. */}
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

      {/* Required by the fluid simulation's MIT licence. */}
      <p className="t-small mt-8">
        Built by {profile.name}. The fluid effect is derived from Pavel Dobryakov's
        WebGL-Fluid-Simulation (MIT).
      </p>
    </footer>
  );
}
