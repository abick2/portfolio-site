/** A photograph cut to a fixed-ratio frame, or "Photo to come" when there is none yet. */
export function isPhoto(src: string | null | undefined): src is string {
  return Boolean(src);
}

export default function Frame({
  src,
  alt,
  position,
  ratio = "aspect-[4/3]",
  anchor = "object-center",
  eager = false,
}: {
  src: string | null | undefined;
  alt: string;
  /** Any CSS `object-position`. Inline, because Tailwind cannot compile runtime classes. */
  position?: string;
  ratio?: string;
  /** Screenshots use `object-top`: a page is read from the top. */
  anchor?: string;
  eager?: boolean;
}) {
  return (
    <div className={`${ratio} relative w-full overflow-hidden bg-frame`}>
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
  );
}
