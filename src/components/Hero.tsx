import { profile } from "@/data/profile";

/**
 * The one place the design spends its boldness.
 *
 * The headline carries `mix-blend-mode: difference`, so the fluid simulation
 * behind it tints the letterforms as the cursor sweeps past rather than simply
 * sitting behind them. Separate colours mixing in a shared field is the thing
 * the whole site is arguing about the person — so the argument is made in the
 * type itself, not in a decorative panel.
 *
 * Everything else on this screen stays quiet on purpose.
 */
export default function Hero() {
  return (
    <section className="shell flex min-h-[92svh] flex-col justify-center pt-16 pb-24">
      <h1 className="t-hero rise knockout">
        {profile.headline.map((line, i) => (
          <span key={line} className="block" style={{ animationDelay: `${i * 90}ms` }}>
            {line}
          </span>
        ))}
      </h1>

      <p className="t-lead measure rise mt-8" style={{ animationDelay: "280ms" }}>
        {profile.lede}
      </p>

      <div
        className="rise mt-10 flex flex-wrap items-center gap-3"
        style={{ animationDelay: "400ms" }}
      >
        <a
          href="#work"
          className="sq-full bg-ink px-6 py-3 text-paper transition-transform duration-200 hover:scale-[1.03]"
        >
          See the work
        </a>
        <a
          href="#fun"
          className="glass-2 sq-full px-6 py-3 transition-transform duration-200 hover:scale-[1.03]"
        >
          Or the fun stuff
        </a>
      </div>

      <p
        className="t-small rise mt-14 max-w-[34ch]"
        style={{ animationDelay: "520ms" }}
      >
        Scroll to explore.
      </p>
    </section>
  );
}
