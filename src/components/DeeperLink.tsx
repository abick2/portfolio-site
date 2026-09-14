import Link from "next/link";

/**
 * The site's one drill-down affordance, used five times.
 *
 * The mark is a rule that stretches while the arrow advances. That pairing is
 * the whole idea: the affordance reads as motion *toward* a place rather than
 * as a button that performs an action, which is what makes it feel like a door.
 * A plain "Read more →" would say the same words and mean something duller.
 *
 * It is `--color-bridge`, which the design system otherwise reserves for the
 * two career tracks actually meeting. The justification is that a drill-down
 * from summary into depth is a crossing in the same sense — but this is a
 * deliberate widening of that rule, and it is the one colour decision in the
 * redesign worth a second opinion.
 */

type DeeperSize = "md" | "sm";

/*
  Both sizes stretch their rule to the same 40px on hover. That is on purpose:
  the small pill starts shorter, so it travels further, and the two read as the
  same gesture at different scales rather than as two different components.
*/
const sizing: Record<
  DeeperSize,
  { pill: string; label: string; ring: string; arrow: string }
> = {
  md: {
    pill: "lift-md gap-3 py-3 pr-3.5 pl-[22px] hover:-translate-y-1",
    label: "text-[0.98rem]",
    ring: "w-4",
    arrow: "",
  },
  sm: {
    pill: "lift-sm gap-2.5 py-[9px] pr-3 pl-[18px] hover:-translate-y-[3px]",
    label: "text-[0.9rem]",
    ring: "w-3",
    arrow: "text-[0.9rem]",
  },
};

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/* `translate,scale` — NOT `transform`. Tailwind v4 compiles `-translate-y-1`
   and `scale-*` to the separate `translate` and `scale` CSS properties, so a
   transition list naming only `transform` animates nothing and the lift snaps.
   (`transition-transform` is fine — v4 expands it to all four.) */
const LIFT_TRANSITION = `transition-[translate,scale,box-shadow] ${EASE}`;

export default function DeeperLink({
  href,
  label,
  size = "md",
}: {
  href: string;
  label: string;
  size?: DeeperSize;
}) {
  const s = sizing[size];

  const content = (
    <>
      <span className={s.label}>{label}</span>
      {/*
        Decorative. The label already names the destination, so announcing an
        arrow and a rule would add two meaningless stops to a screen reader's
        pass over five of these.
      */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-end gap-1"
        style={{ color: "var(--color-bridge)" }}
      >
        <span
          className={`sq-full block h-[2px] bg-[var(--color-bridge)] transition-[width] duration-300 ${EASE} ${s.ring} group-hover:w-10 group-focus-visible:w-10`}
        />
        <span
          className={`block transition-transform duration-300 ${EASE} ${s.arrow} group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5`}
        >
          →
        </span>
      </span>
    </>
  );

  /* `group-focus-visible:` alongside every `group-hover:` — the rule and the
     arrow are the only feedback this control gives, so a keyboard user landing
     on it should see the same thing a pointer user does. */
  const className = `group glass-1 sq-full inline-flex items-center ${LIFT_TRANSITION} duration-300 ${s.pill}`;

  // Internal routes get client-side navigation; outbound ones are plain
  // anchors, as everywhere else on the site.
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
