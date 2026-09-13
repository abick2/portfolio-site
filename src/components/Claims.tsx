import { profile } from "@/data/profile";

/**
 * The three claims the site is arguing, stated once and plainly.
 *
 * These sit directly under the hero because they frame everything below: the
 * two-track experience section is the evidence for "connector", the projects
 * mosaic is the evidence for "adaptable", and the whole tone is the evidence
 * for "translator". Do not add a fourth claim without evidence to match.
 */
export default function Claims() {
  return (
    <section className="shell pb-8" aria-labelledby="claims-heading">
      {/* The three claims were h3 directly after the h1, so a screen-reader
          user walking by heading level skipped the site's whole thesis. */}
      <h2 id="claims-heading" className="sr-only">
        What I do
      </h2>
      <div className="glass-2 sq-xl grid grid-cols-1 overflow-hidden md:grid-cols-3">
        {profile.claims.map((claim, i) => (
          <div
            key={claim.id}
            // Hairline separators keep the panel reading as one continuous
            // glass surface rather than three cards. The rule flips from a top
            // border to a left border when the columns come in.
            className="border-ink/10 p-7 not-first:border-t md:not-first:border-t-0 md:not-first:border-l sm:p-9"
          >
            <h3
              className="t-title"
              style={{
                color: [
                  "var(--color-defense)",
                  "var(--color-bridge)",
                  "var(--color-commercial)",
                ][i],
              }}
            >
              {claim.title}
            </h3>
            {/* `measure` matters more here than elsewhere: these are the only
                multi-column paragraphs on the site with no width cap, so in a
                1440 shell each column ran to ~68 characters. */}
            <p className="t-body measure mt-3 text-[1rem]">{claim.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
