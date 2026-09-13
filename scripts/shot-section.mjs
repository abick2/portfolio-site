/**
 * Scroll to a section, then screenshot the viewport.
 *
 *   node scripts/shot-section.mjs <url> <selector> <out.png> [w] [h] [yOffset]
 *
 * `shot.mjs --full` cannot be used to judge anything below the fold on this
 * site: puppeteer's fullPage capture uses captureBeyondViewport, which never
 * actually scrolls, so no IntersectionObserver fires and every `[data-reveal]`
 * section photographs blank. This scrolls for real first.
 */
import puppeteer from "puppeteer-core";
const [url, sel, out, w = "1440", h = "900", off = "0"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(
  async (s, o) => {
    const el = document.querySelector(s);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + +o);
    await new Promise((r) => setTimeout(r, 900));
  },
  sel,
  off,
);
await page.screenshot({ path: out });
console.log("wrote", out);
await browser.close();
