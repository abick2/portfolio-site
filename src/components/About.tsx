import { profile } from "@/data/profile";

/**
 * The personal paragraph, plus outbound links to other sites.
 *
 * Set asymmetrically — portrait in a narrow column, prose in a wide one — so it
 * does not become another centred block. The prose column stays under 62
 * characters.
 */
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <div>
          <div className="photo-lift sq-lg aspect-[4/5] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait/profile_pic.jpg"
              alt={`Portrait of ${profile.name}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="t-section">Hi, I'm Andrew!</h2>

          <div className="mt-6 space-y-5">
            {profile.about.map((para) => (
              <p key={para.slice(0, 40)} className="t-body measure">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="t-title">Elsewhere</h3>
            <ul className="mt-4 space-y-2">
              {profile.elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="glass-1 sq flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 transition-transform duration-200 hover:translate-x-1"
                  >
                    <span className="text-[1.05rem]">{link.label}</span>
                    <span className="t-small">{link.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
