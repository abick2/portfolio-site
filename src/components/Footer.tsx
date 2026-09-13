import { profile } from "@/data/profile";

const social = [
  { label: "Email", href: `mailto:${profile.links.email}` },
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Strava", href: profile.links.strava },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
      <div className="glass-2 sq-xl p-8 sm:p-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="t-display measure-tight">Reach out!</p>
            <a
              href={`mailto:${profile.links.email}`}
              className="sq-full mt-6 inline-block bg-ink px-6 py-3 text-paper transition-transform duration-200 hover:scale-[1.03]"
            >
              {profile.links.email}
            </a>
          </div>

          <ul className="flex flex-wrap gap-2">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="glass-1 sq-full block px-5 py-2.5 text-[0.95rem] transition-transform duration-200 hover:scale-[1.04]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-6">
          <p className="t-small">
            Built by {profile.name}. Background is a WebGL fluid simulation
            derived from Pavel Dobryakov's WebGL-Fluid-Simulation (MIT).
          </p>
        </div>
      </div>
    </footer>
  );
}
