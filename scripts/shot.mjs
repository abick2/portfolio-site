/**
 * Screenshot / inspect harness for local QA.
 *
 * Usage:
 *   node scripts/shot.mjs <url> <out.png> [width] [height] [--full] [--touch]
 *
 * Screenshots composite the WebGL canvas correctly; reading pixels back off the
 * canvas does not, because the sim runs with preserveDrawingBuffer:false.
 * Always measure the fluid by screenshot, never by getImageData.
 */
import puppeteer from "puppeteer-core";

const [url, out, w = "1440", h = "900", ...flags] = process.argv.slice(2);
const full = flags.includes("--full");
const touch = flags.includes("--touch");

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});
const page = await browser.newPage();
await page.setViewport({
  width: +w, height: +h,
  isMobile: touch, hasTouch: touch,
  deviceScaleFactor: touch ? 3 : 2,
});
if (touch) {
  await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1");
}

const msgs = [];
page.on("console", (m) => msgs.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => msgs.push(`[404/fail] ${r.url()} ${r.failure()?.errorText ?? ""}`));

await page.goto(url, { waitUntil: "networkidle0" });

// Drive the pointer so the sim has dye to show.
if (touch) {
  const t = page.touchscreen;
  await t.touchStart(60, 400);
  for (let i = 0; i < 40; i++) {
    await t.touchMove(60 + i * 8, 400 + Math.sin(i / 4) * 120);
    await new Promise((r) => setTimeout(r, 30));
  }
  await t.touchEnd();
} else {
  for (let i = 0; i < 60; i++) {
    await page.mouse.move(150 + i * 20, 450 + Math.sin(i / 5) * 200);
    await new Promise((r) => setTimeout(r, 25));
  }
}
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: out, fullPage: full });

const state = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return { canvas: false };
  const gl = c.getContext("webgl2") || c.getContext("webgl");
  return {
    canvas: true,
    backing: `${c.width}x${c.height}`,
    contextLost: gl ? gl.isContextLost() : null,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    docScrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
  };
});

console.log(JSON.stringify(state, null, 2));
if (msgs.length) console.log("\n--- console ---\n" + msgs.slice(0, 25).join("\n"));
console.log("\nwrote", out);
await browser.close();
