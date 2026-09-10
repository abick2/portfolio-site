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
}: {
  title: string;
  records: PersonalRecord[];
}) {
  const headline = records.filter((r) => r.headline);
  const rest = records.filter((r) => !r.headline);

  return (
    <div>
      {/* h2, not h3: this renders directly under the page h1. */}
      <h2 className="t-title">{title}</h2>

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
        <table className="mt-6 w-full border-collapse text-left">
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
                <th scope="row" className="py-3 pr-4 text-left text-[0.95rem] font-normal">
                  {r.event}
                </th>
                <td className="tabular py-3 pr-4 text-[0.95rem]">{r.time}</td>
                <td className="t-small py-3 pr-4">{r.race}</td>
                <td className="t-small tabular py-3 text-right">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
