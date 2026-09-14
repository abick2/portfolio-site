import PRTable from "@/components/PRTable";
import { running, triathlon } from "@/data/athletics";

/**
 * Race times, as themselves.
 *
 * Each panel is the FULL content width, which is a constraint rather than a
 * taste call. `PRTable` renders its headline records into its own two-up grid
 * with the time at `t-display` — up to 68px — and "1:15:40" needs 213px there.
 * Halving the outer column leaves each figure card around 199px and the number
 * runs off the right edge. Let the table's own grid do the splitting.
 */
export default function Numbers() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-[12vh]">
      <h2 className="t-section">Numbers</h2>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5">
        <div className="glass-2 sq-lg p-[clamp(1rem,4vw,1.75rem)]">
          <PRTable title="Running" records={running} headingLevel={3} />
        </div>
        <div className="glass-2 sq-lg p-[clamp(1rem,4vw,1.75rem)]">
          <PRTable title="Triathlon" records={triathlon} headingLevel={3} />
        </div>
      </div>
    </section>
  );
}
