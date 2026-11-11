"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const items = [
  { label: "Work", href: "/#career" },
  { label: "Projects", href: "/#work" },
  { label: "Play", href: "/#play" },
  { label: "About", href: "/#about" },
];

/**
 * A plain bar: the name, and four places on the page.
 *
 * Opaque wall colour rather than glass, so it never tints the photographs
 * scrolling under it. Constant height and no transition on the header itself —
 * it is an in-flow sticky element, so anything that changed its box would
 * slide the whole page.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

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
    <header className="sticky top-0 z-50 bg-wall">
      <nav
        aria-label="Main"
        className="page flex h-16 items-center justify-between gap-6"
      >
        <Link href="/" className="t-title inline-flex min-h-11 shrink-0 items-center">
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="t-label inline-flex min-h-11 items-center text-label transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-3 grid h-11 w-11 place-items-center md:hidden"
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
        <div id="mobile-menu" className="border-t border-ink/10 bg-wall md:hidden">
          <ul className="page py-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-title block py-3">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
