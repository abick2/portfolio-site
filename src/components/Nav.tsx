"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion, useScrollProgress } from "@/hooks/useScrollProgress";

const items = [
  { label: "Work", href: "/#work" },
  { label: "Play", href: "/#play" },
];

/**
 * Always the lifted floating pill.
 *
 * The previous header had two states and swapped between them at scrollY 24.
 * That job now belongs to the wordmark, which fills with ink from the bottom as
 * the hero's name drains away above it — one scroll signal instead of two, and
 * the one that actually says something. The header itself no longer moves.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const p = useScrollProgress();

  useEffect(() => setOpen(false), [pathname]);

  // A disclosure that cannot be dismissed with Escape traps keyboard users
  // into shift-tabbing back to the toggle. Focus returns to the button so
  // they do not lose their place.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /*
    The fill only means something on the home page, where there is a hero name
    to hand off from. Everywhere else — and under reduced motion, where progress
    is pinned at 0 — an unfilled wordmark would just be the site's own name in
    12% ink, i.e. invisible. Those cases get solid ink and no gradient at all.
  */
  const filling = pathname === "/" && !reduced;
  const fill = `${(Math.max(0, p - 0.12) / 0.88) * 100}%`;

  /*
    Size and tracking are inline rather than Tailwind utilities, and that is not
    a style choice. The `t-*` classes in globals.css sit OUTSIDE any cascade
    layer, and unlayered CSS beats anything in `@layer utilities` no matter the
    specificity — so `text-[1.05rem]` here would lose to `.t-title`'s clamp and
    silently do nothing. Every `t-*` size override in this redesign is inline
    for the same reason.
  */
  const wordmarkStyle: React.CSSProperties = {
    fontSize: "1.05rem",
    letterSpacing: "-0.02em",
    ...(filling
      ? {
          backgroundImage: `linear-gradient(to top, var(--color-ink) ${fill}, rgba(15,27,46,0.12) ${fill})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }
      : null),
  };

  return (
    // Constant height, and no transition on the header itself. Both are
    // deliberate: this is an in-flow sticky element, so anything that changes
    // its box slides the whole page.
    <header className="sticky top-0 z-50 px-4 py-3">
      <nav
        aria-label="Main"
        className="glass-1 sq-full mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 pr-2.5 pl-5"
      >
        <Link
          href="/"
          className="t-title inline-flex min-h-11 shrink-0 items-center"
          style={wordmarkStyle}
        >
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="sq-full block px-3.5 py-2 text-[0.95rem] text-slate transition-colors duration-200 hover:bg-white/70 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={`mailto:${profile.links.email}`}
              className="sq-full block bg-ink px-[18px] py-2.5 text-[0.95rem] text-paper transition-transform duration-200 hover:scale-[1.05]"
            >
              Say hello
            </a>
          </li>
        </ul>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="sq-full grid h-11 w-11 place-items-center md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? "top-[5px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? "top-[5px] -rotate-45" : "top-[10px]"
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="glass-2 sq-lg mx-auto mt-2 max-w-6xl overflow-hidden p-2 md:hidden"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="sq block px-4 py-3 text-lg transition-colors hover:bg-white/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${profile.links.email}`}
                className="sq mt-1 block bg-ink px-4 py-3 text-lg text-paper"
              >
                Say hello
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
