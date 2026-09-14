/**
 * Measures every image on the built site against the size it actually renders
 * at, so oversized files can be found without guessing.
 *
 *   npm run build && node scripts/image-audit.mjs
 *
 * Serves `out/`, walks every page it finds there, and for each image reports
 * the decoded pixel width against the device pixels it actually needs. A photo
 * shipped at 4032px for a 355px card is 5.7x oversampled and is costing about
 * 30x the bytes it needs to.
 *
 * Measured at two viewports, because the frame that needs the most pixels is
 * usually not the widest one: a card that is 355 CSS px on a desktop is about
 * the same on a phone, where the screen is 3x — so the phone wants more device
 * pixels than the desktop does at 2x. Taking only the desktop number reports
 * a correctly-sized image as oversized.
 *
 * Reads `out/`, never `public/` — what matters is the size a browser resolves
 * after `object-fit` and the layout, which only exists once the page is real.
 */
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import puppeteer from "puppeteer-core";

const ROOT = "out";
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = await walk(ROOT);
const routes = files
  .filter((f) => f.endsWith("index.html"))
  .map((f) => "/" + relative(ROOT, f).replace(/index\.html$/, ""));

const server = createServer(async (req, res) => {
  let p = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  try {
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
  } catch {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(p);
    res.writeHead(200, {
      "content-type": TYPES[extname(p)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});

/* [viewport width, device pixel ratio to provision for at that width] */
const VIEWPORTS = [
  [1440, 2], // desktop: the max-w-6xl container is at its cap here
  [390, 3], // phone: narrower frames, but a much denser screen
];

const seen = new Map();
for (const [vw, dpr] of VIEWPORTS)
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: vw, height: 1000 });
    await page.goto(base + route, { waitUntil: "networkidle0" });
    // Lazy images never decode above the fold — without this they report 0.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.evaluate(() =>
      Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {}))),
    );
    for (const img of await page.$$eval("img", (els) =>
      els.map((i) => ({
        src: new URL(i.currentSrc || i.src).pathname,
        nat: i.naturalWidth,
        css: Math.round(i.getBoundingClientRect().width),
      })),
    )) {
      if (!/\.(jpe?g|png|webp|avif)$/i.test(img.src)) continue; // SVG has no fixed size
      const prev = seen.get(img.src);
      seen.set(img.src, {
        nat: Math.max(img.nat, prev?.nat ?? 0),
        css: Math.max(img.css, prev?.css ?? 0),
        // What the densest screen showing this frame actually asks for.
        need: Math.max(Math.round(img.css * dpr), prev?.need ?? 0),
      });
    }
    await page.close();
  }
await browser.close();
server.close();

const rows = [...seen.entries()]
  .map(([src, v]) => {
    const bytes = statSync(join(ROOT, src)).size;
    /*
      Large frames get three quarters of their nominal requirement. On a photo
      filling half the screen the difference between 1.5x and 2x is invisible
      and costs about double the bytes; on a small frame — a card, a thumbnail,
      anything carrying text — it is not worth the risk.
    */
    const need = v.css >= 800 ? Math.round(v.need * 0.75) : v.need;
    return { src, bytes, ...v, need, over: v.nat / need };
  })
  .sort((a, b) => b.bytes - a.bytes);

const total = rows.reduce((s, r) => s + r.bytes, 0);
/*
  1.5x, not 1.1x. Rewriting a file is lossy and costs a commit, so the bar for
  "worth it" is real waste, not a rounding error — and an audit that nags about
  borderline cases stops being read. Under 0.6x is the opposite problem: an
  image with visibly fewer pixels than its frame.
*/
const FAT = 1.5;
const THIN = 0.6;

const col = (s, n) => String(s).padStart(n);
console.log(
  `${"file".padEnd(44)}${col("KB", 7)}${col("natural", 9)}${col("drawn", 7)}${col("needs", 7)}${col("over", 7)}`,
);
for (const r of rows) {
  console.log(
    `${r.src.padEnd(44)}${col(Math.round(r.bytes / 1024), 7)}${col(r.nat, 9)}${col(r.css, 7)}${col(r.need, 7)}${col(`${r.over.toFixed(1)}x`, 7)}${r.over > FAT ? "  ← resize" : r.over < THIN ? "  ← low-res for its frame" : ""}`,
  );
}
console.log(`\n${rows.length} raster images, ${Math.round(total / 1024)} KB total`);
const fat = rows.filter((r) => r.over > FAT);
if (fat.length) {
  console.log(`\n${fat.length} oversized. To fix:`);
  for (const r of fat)
    console.log(`  node scripts/image-resize.mjs --max ${r.need} public${r.src}`);
} else {
  console.log("\nNothing oversized.");
}
const thin = rows.filter((r) => r.over < THIN);
if (thin.length) {
  console.log(
    `\n${thin.length} thinner than their frame — re-export from the original if you have it:`,
  );
  for (const r of thin)
    console.log(`  public${r.src}  ${r.nat}px for a ${r.need}px frame`);
}
