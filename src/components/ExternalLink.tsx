/**
 * Every link that leaves the site. Opens a new tab, says so to screen readers,
 * and carries a small drawn arrow so sighted visitors know before they click.
 *
 * `mailto:` links do NOT use this. A `target="_blank"` mailto opens the mail
 * client AND leaves an empty tab behind in Chrome and Safari.
 */
export default function ExternalLink({
  href,
  children,
  className = "",
  arrow = true,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Off for links whose whole body is an image, where the arrow has no line to sit on. */
  arrow?: boolean;
  "aria-label"?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel ? `${ariaLabel} (opens in a new tab)` : undefined}
    >
      {children}
      {arrow && <ArrowOut />}
      {!ariaLabel && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** Up-and-right arrow, drawn at the text's cap height. */
export function ArrowOut() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="ml-[0.3em] inline-block h-[0.7em] w-[0.7em] align-[0.02em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9L9 3M4 3h5v5" />
    </svg>
  );
}
