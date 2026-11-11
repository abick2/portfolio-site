/**
 * Screenshots each live project site for its cover (4:3, home grid) and hero
 * (16:9, detail page). Re-run when a site changes:
 *
 *   node scripts/site-preview.mjs            # all three
 *   node scripts/site-preview.mjs coverage   # just one
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

const only = process.argv.slice(2);
const chosen = only.length ? sites.filter((s) => only.includes(s.name)) : sites;
if (!chosen.length) throw new Error(`no site named ${only.join(", ")}`);

for (const site of chosen) {
  for (const which of ["cover", "hero"]) {
    const { width, height } = site[which];
    const out = `public/images/projects/${site.name}-${which}.webp`;
    const page = await browser.newPage();
    // Covers render small, so 1x is plenty; heroes fill ~1100px, so 1.5x.
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
