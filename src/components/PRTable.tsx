import type { PersonalRecord } from "@/data/athletics";

/**
 * Personal records.
 *
 * Headline records break out of the table entirely and get display-size
 * treatment; the rest stay as compact rows. A time you care about and a time
 * you merely have should not look identical.
 *
 * Figures use tabular numerals so columns align without reaching for a
 * monospace face.
 */
export default function PRTable({
  title,
  records,
  headingLevel = 2,
}: {
  title: string;
  records: PersonalRecord[];
  /**
   * The hobby detail pages render this directly under their `h1`, so 2 is the
   * right default. The home page's Numbers section puts it under an `h2` of
   * its own, where a second `h2` would flatten the outline.
   */
  headingLevel?: 2 | 3;
}) {
  const headline = records.filter((r) => r.headline);
  const rest = records.filter((r) => !r.headline);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <div>
      <Heading className="t-title">{title}</Heading>

      {headline.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {headline.map((r) => (
            <div key={r.event} className="glass-2 sq-lg p-6">
              <p className="t-small">{r.event}</p>
              <p className="t-display tabular mt-2 leading-none">{r.time}</p>
              {r.detail && <p className="t-small tabular mt-3">{r.detail}</p>}
              <p className="t-small mt-3">
                {r.race}, {r.date}
              </p>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        /*
          The four columns have a combined min-content width of about 280px, so
          below roughly a 370px viewport the table is wider than the panel that
          holds it. It scrolls itself rather than pushing the whole page into
          horizontal scroll.

          `tabIndex` is required, not decorative: a scroll container that only
          a pointer can reach is unusable by keyboard, and Chrome does not make
          these focusable on its own. A focusable region needs an accessible
          name, hence the role and label.
        */
        <section
          className="mt-6 overflow-x-auto"
          tabIndex={0}
          aria-label={`${title} records`}
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="t-small py-2 pr-4 font-normal">
                  Distance
                </th>
                <th scope="col" className="t-small py-2 pr-4 font-normal">
                  Time
                </th>
                <th scope="col" className="t-small py-2 pr-4 font-normal">
                  Where
                </th>
                <th scope="col" className="t-small py-2 text-right font-normal">
                  Year
                </th>
              </tr>
            </thead>
            <tbody>
              {rest.map((r) => (
                <tr key={r.event} className="border-b border-ink/[0.06]">
                  {/* Row header, so table navigation announces the distance
                    when moving across the row. */}
                  <th
                    scope="row"
                    className="py-3 pr-4 text-left text-[0.95rem] font-normal"
                  >
                    {r.event}
                  </th>
                  <td className="tabular py-3 pr-4 text-[0.95rem]">{r.time}</td>
                  <td className="t-small py-3 pr-4">{r.race}</td>
                  <td className="t-small tabular py-3 text-right">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
