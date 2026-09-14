/**
 * Resizes and re-encodes images in place, through Chrome.
 *
 *   node scripts/image-resize.mjs --max 1656 public/images/projects/a.jpeg …
 *   node scripts/image-resize.mjs --max 1400 --quality 0.8 --out-dir tmp/ file…
 *
 * Chrome rather than `sips` on purpose: sips spends about 0.44 bytes/px at q70
 * and its quality scale is not libjpeg's, so a "q80" file comes out two to
 * three times larger than it should. Chrome also bakes EXIF orientation into
 * the pixels, which removes a class of surprise where a file's stored
 * dimensions disagree with how a browser draws it.
 *
 * Originals are copied to `<file>.orig` beside each file before it is touched,
 * unless --out-dir writes elsewhere. Delete them once you are happy, or keep
 * the masters somewhere durable — this script is lossy and not reversible.
 *
 * `--max` is the longest side, in real pixels. Get it from
 * `node scripts/image-audit.mjs`, which prints the exact command.
 */
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { basename, join } from "node:path";
import puppeteer from "puppeteer-core";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const max = Number(flag("max", 0));
const quality = Number(flag("quality", 0.82));
const outDir = flag("out-dir", null);
const keep = !argv.includes("--no-backup");
const files = argv.filter(
  (a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"),
);

if (!max || !files.length) {
  console.error(
    "usage: node scripts/image-resize.mjs --max <px> [--quality 0.82] [--out-dir dir] [--no-backup] <files…>",
  );
  process.exit(1);
}
if (outDir) mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});
const page = await browser.newPage();

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`);
    continue;
  }
  const before = readFileSync(file);
  const mime = /\.png$/i.test(file)
    ? "image/png"
    : /\.webp$/i.test(file)
      ? "image/webp"
      : "image/jpeg";
  const result = await page.evaluate(
    async (b64, inMime, max, quality, outMime) => {
      const img = new Image();
      img.src = `data:${inMime};base64,${b64}`;
      await img.decode();
      // naturalWidth/Height are already EXIF-oriented, and drawImage uses the
      // same oriented bitmap, so the aspect ratio a browser lays out with is
      // preserved exactly.
      const from = { w: img.naturalWidth, h: img.naturalHeight };
      const scale = Math.min(1, max / Math.max(from.w, from.h));
      const w = Math.round(from.w * scale);
      const h = Math.round(from.h * scale);
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const blob = await canvas.convertToBlob({ type: outMime, quality });
      return {
        from,
        w,
        h,
        bytes: Array.from(new Uint8Array(await blob.arrayBuffer())),
      };
    },
    before.toString("base64"),
    mime,
    max,
    quality,
    mime,
  );

  const buf = Buffer.from(result.bytes);
  const target = outDir ? join(outDir, basename(file)) : file;
  if (!outDir && keep && !existsSync(`${file}.orig`))
    copyFileSync(file, `${file}.orig`);
  writeFileSync(target, buf);

  /*
    Compared with a tolerance, not exactly: integer rounding on the target
    dimensions shifts the ratio a hair every time (1400x933 -> 600x400 is
    1.5005 vs 1.5000), and a warning that cries wolf on every file is worse
    than no warning. A real change here means EXIF — the stored dimensions
    disagreed with how a browser draws it — and that is a whole flip, not 0.05%.
  */
  const from = result.from.w / result.from.h;
  const to = result.w / result.h;
  const same = Math.abs(from - to) / from < 0.005;
  console.log(
    `${target}\n  ${result.from.w}x${result.from.h} ${(before.length / 1024).toFixed(0)} KB` +
      ` →  ${result.w}x${result.h} ${(buf.length / 1024).toFixed(0)} KB` +
      `   (${(100 - (buf.length / before.length) * 100).toFixed(0)}% smaller, ratio ${same ? "unchanged" : "CHANGED — check the crop"})`,
  );
}

await browser.close();
