/** A home-page section: hairline, heading row with an optional aside, content. */
export default function Section({
  id,
  title,
  aside,
  children,
}: {
  id?: string;
  title: string;
  /** Short note or link on the right of the heading row. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="page pb-[clamp(5rem,10vw,9rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-ink/15 pt-5">
        <h2 className="t-section">{title}</h2>
        {aside && <div className="t-small">{aside}</div>}
      </div>
      <div className="mt-[clamp(2rem,4vw,3.5rem)]">{children}</div>
    </section>
  );
}
