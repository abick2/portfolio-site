/**
 * Captures the landing page of each linked live site as its project imagery.
 * Re-run when one of those sites is redesigned:
 *
 *   node scripts/site-preview.mjs            # all three
 *   node scripts/site-preview.mjs coverage   # just one
 *
 * Two shots per site, because the two places a cover appears crop it very
 * differently and a screenshot's edges are the part that names the page:
 *
 *   `-cover`  the home grid card. Every card is exactly 4:3 (`Frame`, no
 *             min-height), so every cover is shot at 1440x1080 — a desktop
 *             layout of the site, at a width that also covers a 3x phone.
 *   `-hero`   the 16/9 frame at the top of /projects/<slug>. Shot at exactly
 *             16/9 so the whole page shows, uncropped.
 */
import puppeteer from "puppeteer-core";

const sites = [
  {
    url: "https://venture-sim.vercel.app/",
    name: "venture",
    cover: { width: 1440, height: 1080 },
    hero: { width: 1440, height: 810 },
  },
  {
    url: "https://triathlon-training-site-v2.vercel.app/today",
    name: "triathlon",
    cover: { width: 1440, height: 1080 },
    hero: { width: 1440, height: 810 },
  },
  {
    url: "https://abick2.github.io/strava-burg-coverage/",
    name: "coverage",
    cover: { width: 1440, height: 1080 },
    hero: { width: 1440, height: 810 },
  },
];

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--hide-scrollbars"],
});

/* Optional argv filter, so re-shaping one card does not rewrite all six. */
const only = process.argv.slice(2);
const chosen = only.length ? sites.filter((s) => only.includes(s.name)) : sites;
if (!chosen.length) throw new Error(`no site named ${only.join(", ")}`);

for (const site of chosen) {
  for (const which of ["cover", "hero"]) {
    const { width, height } = site[which];
    const out = `public/images/projects/${site.name}-${which}.webp`;
    const page = await browser.newPage();
    /*
      Scale is set against the size each shot is displayed at, not the viewport
      it was taken in. A cover is shot wide so the site lays itself out for a
      desktop, but it renders into a ~355px card, so its CSS pixels are already
      several times the density a retina screen asks for. A hero fills ~1100px,
      so it gets 1.5x. Shooting all six at 2x made the home page carry about a
      megabyte of covers for no visible gain.
    */
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: which === "hero" ? 1.5 : 1,
    });
    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 60000 });
    // Map tiles and client-rendered panels arrive after the network goes quiet.
    await new Promise((r) => setTimeout(r, 5000));
    await page.screenshot({ path: out, type: "webp", quality: 90 });
    await page.close();
    console.log(`${out}  ${width}x${height}  <-  ${site.url}`);
  }
}

await browser.close();
