"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const items = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/#projects" },
  { label: "Play", href: "/#play" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // The nav sits flush at the top of the hero and lifts into a floating pill
  // once you leave it. Motion here answers an action (scrolling), which is the
  // kind worth having.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    /*
      Height is constant across both states. Previously the lifted and
      unlifted headers differed by 3-7px, and because `transition-all` sits on
      an in-flow sticky element, every crossing of scrollY 24 slid the entire
      page down and back for half a second.
    */
    <header
      className={`sticky top-0 z-50 h-[68px] transition-colors duration-500 sm:h-[72px] ${
        lifted
          ? "px-3 pt-3 sm:px-6 sm:pt-4"
          : "border-b border-white/40 bg-white/25 backdrop-blur-md"
      }`}
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 ${
lifted ? "glass-1 sq-full h-14" : "h-[67px] sm:h-[71px]"
        }`}
      >
        <Link
          href="/"
          className="t-title inline-flex min-h-11 shrink-0 items-center tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="sq-full block px-4 py-2 text-[0.95rem] text-slate transition-colors duration-200 hover:bg-white/60 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={`mailto:${profile.links.email}`}
              className="sq-full block bg-ink px-4 py-2 text-[0.95rem] text-paper transition-transform duration-200 hover:scale-[1.03]"
            >
              Get in touch
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
                Get in touch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
