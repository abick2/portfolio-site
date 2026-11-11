import type { PersonalRecord } from "@/data/athletics";

/** Headline records at display size, the rest as table rows. */
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
      <h2 className="t-label">{title}</h2>

      {headline.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-8 sm:grid-cols-2">
          {headline.map((r) => (
            <div key={r.event} className="border-t border-ink pt-4">
              <p className="t-label">{r.event}</p>
              <p className="t-figure mt-3 text-[clamp(2.5rem,5vw,4rem)]">{r.time}</p>
              {r.detail && <p className="t-small tabular mt-3">{r.detail}</p>}
              <p className="t-small mt-3">
                {r.race}, {r.date}
              </p>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        // Scrolls itself below ~370px instead of the page. Focusable (and so
        // labelled) so keyboard users can scroll it.
        <section
          className="mt-6 overflow-x-auto"
          tabIndex={0}
          aria-label={`${title} records`}
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-ink/15">
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
                <tr key={r.event} className="border-b border-ink/10">
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
