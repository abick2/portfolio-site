/**
 * A hung photograph: a hard-edged frame at a fixed ratio with the image cut to
 * fill it. Every picture on the home page goes through this, so every frame in
 * a row is exactly the same box whatever shape the file is.
 *
 * Frames without a real photograph show an honest "photo to come" card rather
 * than a gradient pretending to be one. The generated placeholders written by
 * `scripts/make-placeholders.mjs` are all SVGs, so the extension is a reliable
 * way to tell a stand-in from a photo.
 */
export function isPhoto(src: string | null | undefined): src is string {
  return Boolean(src) && !(src as string).endsWith(".svg");
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
  /** Manual crop — any CSS `object-position` value. Inline, because Tailwind
      cannot compile a class it only sees at runtime. */
  position?: string;
  ratio?: string;
  /** Default crop anchor. Screenshots use `object-top`: a page is read from the top. */
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
