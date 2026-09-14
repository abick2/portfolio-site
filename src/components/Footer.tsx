import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-10">
      {/*
        Clamped rather than a flat 48px. At 320px a 48px inset leaves 176px of
        content inside a 272px column, and the email button alone is wider than
        that — the page went into horizontal scroll. This resolves to the
        design's 48px from about 960px up and tightens below it.
      */}
      <div className="glass-2 sq-xl p-[clamp(1.5rem,5vw,3rem)]">
        <p className="t-display max-w-[20ch]">Let's talk.</p>
        <a
          href={`mailto:${profile.links.email}`}
          /* `max-w-full` plus `anywhere` wrapping: the address is a single
             long token, so without a break opportunity it sets the minimum
             width of the whole page. */
          className="sq-full mt-6.5 inline-block max-w-full bg-ink px-7 py-3.5 text-paper [overflow-wrap:anywhere] transition-transform duration-[250ms] hover:-translate-y-[3px] hover:scale-[1.04]"
        >
          {profile.links.email}
        </a>

        {/* The WebGL-Fluid-Simulation credit is required by its MIT licence,
            not optional politeness. Do not drop it. */}
        <p className="t-small mt-11 border-t border-ink/10 pt-[22px]">
          Built by {profile.name}. Background is a WebGL fluid simulation derived from
          Pavel Dobryakov's WebGL-Fluid-Simulation (MIT).
        </p>
      </div>
    </footer>
  );
}
