import { profile } from "@/data/profile";

/**
 * The personal paragraph.
 *
 * Set asymmetrically — portrait in a narrow column, prose in a wide one — so it
 * does not become another centred block. Two paragraphs only: the hobby rows
 * above now carry the travel, the running and the cooking, so this has to do
 * the one thing they cannot.
 *
 * The old "Elsewhere" list is gone. Those three sites are all in the projects
 * mosaic, so listing them again here was the same links twice; what ends the
 * section now is three social pills.
 */

const social = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Strava", href: profile.links.strava },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 pb-[12vh]">
      <div className="grid grid-cols-1 items-start gap-8 wide:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] wide:gap-14">
        {/* Capped in the single-column layout: a 4:5 portrait allowed to fill
            a phone width is a full screen of face before any of the words. */}
        <div className="photo-lift sq-lg aspect-[4/5] max-w-[320px] overflow-hidden wide:max-w-none">
          <img
            src="/images/portrait/profile_pic.jpg"
            alt={`Portrait of ${profile.name}`}
            loading="lazy"
            /* Crop dial: this image is hard-coded rather than data-driven, so
               re-crop it here — swap `object-center` for e.g.
               `object-[50%_30%]` to favour the top of the frame. */
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div>
          <h2 className="t-section">Iowa, then Virginia, now DC</h2>

          {profile.about.map((para, i) => (
            <p
              key={para.slice(0, 40)}
              className={`t-body max-w-[52ch] ${i === 0 ? "mt-5.5" : "mt-4"}`}
            >
              {para}
            </p>
          ))}

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {social.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="glass-1 sq-full block px-[22px] py-[11px] text-[0.95rem] transition-transform duration-[250ms] hover:-translate-y-[3px] hover:scale-[1.04]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
