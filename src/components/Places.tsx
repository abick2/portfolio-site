import DeeperLink from "@/components/DeeperLink";
import WorldMap from "@/components/WorldMap";

export default function Places() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-[12vh]">
      <div className="flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="t-section">Places</h2>
        {/* The small pill. On a heading baseline it has to sit lower than the
            display type beside it, which is what the smaller size buys. */}
        <DeeperLink href="/play/travel" label="Go deeper on travel" size="sm" />
      </div>

      <div className="mt-8">
        <WorldMap headingLevel={3} />
      </div>
    </section>
  );
}
