/** A photograph cut to a fixed-ratio frame, or "Photo to come" when there is none yet. */
export function isPhoto(src: string | null | undefined): src is string {
  return Boolean(src);
}

/** The squircle mask drawn for each frame ratio (see scripts/squircle.mjs). */
const SQUIRCLE = {
  "aspect-[4/3]": "squircle-4x3",
  "aspect-[16/9]": "squircle-16x9",
  "aspect-[4/5]": "squircle-4x5",
} as const;

export default function Frame({
  src,
  alt,
  position,
  ratio = "aspect-[4/3]",
  anchor = "object-center",
  eager = false,
  corners = "squircle",
  windowBar = false,
}: {
  src: string | null | undefined;
  alt: string;
  /** Any CSS `object-position`. Inline, because Tailwind cannot compile runtime classes. */
  position?: string;
  ratio?: keyof typeof SQUIRCLE;
  /** Screenshots use `object-top`: a page is read from the top. */
  anchor?: string;
  eager?: boolean;
  /**
   * `squircle` is the app-icon cut; `window` is a Mac window's small corner,
   * scaled with the title bar so a card and a hero keep the same proportion.
   */
  corners?: "squircle" | "window";
  /** A dark Mac window title bar above the image, for live-site screenshots. */
  windowBar?: boolean;
}) {
  // The outer box is the size container, so `cqw` in the radius and the bar
  // measure the frame's own width.
  return (
    <div
      className={`${ratio} ${corners === "squircle" ? SQUIRCLE[ratio] : ""} @container relative w-full`}
    >
      <div
        className={`absolute inset-0 flex flex-col overflow-hidden bg-frame ${corners === "window" ? "rounded-[clamp(0.5rem,1.6cqw,0.875rem)]" : ""}`}
      >
        {windowBar && (
          <div
            aria-hidden
            className="flex h-[clamp(1.25rem,4cqw,2.25rem)] shrink-0 items-center gap-[clamp(0.3rem,1cqw,0.5rem)] bg-ink-soft pl-[clamp(0.5rem,1.8cqw,1rem)]"
          >
            <span className="size-[clamp(0.5rem,1.4cqw,0.8125rem)] rounded-full bg-light-close" />
            <span className="size-[clamp(0.5rem,1.4cqw,0.8125rem)] rounded-full bg-light-minimise" />
            <span className="size-[clamp(0.5rem,1.4cqw,0.8125rem)] rounded-full bg-light-zoom" />
          </div>
        )}
        <div className="relative flex-1">
          {isPhoto(src) ? (
            <img
              src={src}
              alt={alt}
              loading={eager ? undefined : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover ${anchor}`}
              style={position ? { objectPosition: position } : undefined}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <p className="t-label text-label">Photo to come</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
