/**
 * Interaction tests for the hobby carousel, the lightbox and the path chooser.
 *
 *   npm run dev           # in another shell
 *   node scripts/test-fun.mjs <screenshot-dir>
 *
 * Exits non-zero on any failure. Run headless; the one thing it cannot check
 * here is the scrim's actual blur, because SwiftShader drops `backdrop-filter`
 * outright — that needs a headful browser.
 */
import puppeteer from "puppeteer-core";

const OUT = process.argv[2];
const pass = [],
  fail = [];
const t = (name, ok, extra = "") =>
  (ok ? pass : fail).push(name + (extra ? ` — ${extra}` : ""));

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
const errs = [];
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errs.push("console: " + m.text());
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- scroll the first chapter into view -----------------------------------
await page.evaluate(() => {
  const el = document.querySelector('[aria-label="Running photos"]');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150);
});
await sleep(800);

// --- 1. autoplay advances -------------------------------------------------
const idxOf = () =>
  page.$$eval('[aria-label="Running photos"] [aria-roledescription="slide"]', (ns) =>
    ns.findIndex((n) => !n.hasAttribute("inert")),
  );
const before = await idxOf();
await sleep(6200);
const after = await idxOf();
t("autoplay advances unprompted", after !== before, `${before} -> ${after}`);

// --- 2. manual interaction permanently surrenders autoplay ----------------
await page.click(
  '[aria-label="Running photos"] ~ div button:nth-child(1), [aria-label="Show photo 3 of 6"]',
);
await sleep(400);
const surrendered = await page.$eval('[aria-label="Running photos"]', (n) =>
  n.parentElement.className.includes("is-surrendered"),
);
t("manual click surrenders autoplay", surrendered);
const idxAfterDot = await idxOf();
await sleep(6200);
t(
  "autoplay stays surrendered",
  (await idxOf()) === idxAfterDot,
  `stayed at ${idxAfterDot}`,
);

// --- 2b. carousel mechanics ----------------------------------------------
const tx = () =>
  page.$eval('[aria-label="Running photos"] > div', (n) => n.style.transform);

// Arrow keys must work from the dots, which live OUTSIDE the Embla viewport.
await page.focus('[aria-label="Show photo 1 of 6"]');
const k0 = await idxOf();
await page.keyboard.press("ArrowRight");
await sleep(600);
t("arrow keys work with a dot focused", (await idxOf()) !== k0);

// Without layer promotion Chrome repaints the full photo every frame.
const willChange = await page.$eval(
  '[aria-label="Running photos"] > div',
  (n) => getComputedStyle(n).willChange,
);
t("moving container is promoted", willChange.includes("transform"), willChange);

// Live finger-follow drag: the track must move before the pointer is released.
const box = await page.$eval('[aria-label="Running photos"]', (n) => {
  const r = n.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
const preDrag = await tx();
await page.mouse.move(box.x, box.y);
await page.mouse.down();
await page.mouse.move(box.x - 60, box.y, { steps: 8 });
await sleep(120);
const midDrag = await tx();
await page.mouse.up();
await sleep(600);
t("drag follows the pointer", midDrag !== preDrag, `${preDrag} -> ${midDrag}`);

// Looping from the last slide to the first must advance one step, not sweep
// backwards across the whole strip.
await page.evaluate(() =>
  document.querySelector('[aria-label="Show photo 6 of 6"]').click(),
);
await sleep(900);
const atLast = parseFloat((await tx()).match(/-?[\d.]+px/)?.[0] ?? "0");
await page.evaluate(() =>
  document.querySelector('[aria-label="Show photo 1 of 6"]').click(),
);
await sleep(900);
const atFirst = parseFloat((await tx()).match(/-?[\d.]+px/)?.[0] ?? "0");
const slideW = await page.$eval(
  '[aria-label="Running photos"]',
  (n) => n.getBoundingClientRect().width,
);
const travelled = Math.abs(atFirst - atLast);
t(
  "loop advances one step, not a reverse sweep",
  travelled < slideW * 1.5,
  `${Math.round(travelled)}px vs one slide ${Math.round(slideW)}px`,
);

// --- 3. open the lightbox -------------------------------------------------
await page.evaluate(() => {
  const slides = document.querySelectorAll(
    '[aria-label="Running photos"] [aria-roledescription="slide"]',
  );
  const btn = [...slides].find((s) => !s.hasAttribute("inert")).querySelector("button");
  // Focus first: a bare .click() does not move focus, but a real click does,
  // and focus-restore-on-close is only meaningful if something had focus.
  btn.focus();
  btn.click();
});
await sleep(600);
const dialog = await page.$('[role="dialog"]');
t("lightbox opens", !!dialog);

const state = await page.evaluate(() => ({
  scrim: !!document.querySelector(".lightbox-scrim"),
  scrimClass: document.querySelector(".lightbox-scrim").className,
  bodyOverflow: document.body.style.overflow,
  appInert: document.getElementById("app-root")?.hasAttribute("inert"),
  focusLabel: document.activeElement?.getAttribute("aria-label"),
  portalParent: document.querySelector('[role="dialog"]')?.parentElement?.tagName,
  counter: document.querySelector("figcaption")?.textContent,
}));
// Headless SwiftShader drops backdrop-filter entirely, so the blur itself is
// asserted in the headful run (_blur.mjs). Here we only check it is declared.
t(
  "scrim declares backdrop blur",
  state.scrimClass.includes("backdrop-blur-[32px]"),
  state.scrimClass,
);
t("body scroll locked", state.bodyOverflow === "hidden");
t("page marked inert", state.appInert === true);
t(
  "focus moved to close button",
  state.focusLabel === "Close (Esc)",
  String(state.focusLabel),
);
t(
  "rendered through portal on body",
  state.portalParent === "BODY",
  String(state.portalParent),
);

await page.screenshot({ path: OUT + "/lightbox-open.png" });

// --- 4. arrow-key navigation ---------------------------------------------
const counterNow = () =>
  page.$eval("figcaption", (n) => n.textContent.match(/(\d+) \/ (\d+)/)?.[0]);
const c0 = await counterNow();
await page.keyboard.press("ArrowRight");
await sleep(250);
await page.keyboard.press("ArrowRight");
await sleep(350);
const c2 = await counterNow();
t("arrow keys step the lightbox", c0 !== c2, `${c0} -> ${c2}`);

// --- 5. focus trap --------------------------------------------------------
const trapped = await page.evaluate(async () => {
  const dlg = document.querySelector('[role="dialog"]');
  for (let i = 0; i < 12; i++) {
    const e = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
    document.dispatchEvent(e);
  }
  return dlg.contains(document.activeElement);
});
t("focus stays inside the dialog", trapped);

// --- 6. Escape closes, and the strip followed the lightbox ---------------
const lightboxIdx = Number((await counterNow()).split(" / ")[0]) - 1;
await page.keyboard.press("Escape");
await sleep(700);
const closed = !(await page.$('[role="dialog"]'));
t("Escape closes the lightbox", closed);
const stripIdx = await idxOf();
t(
  "carousel synced to lightbox on close",
  stripIdx === lightboxIdx,
  `strip ${stripIdx} vs lightbox ${lightboxIdx}`,
);

const restored = await page.evaluate(() => ({
  overflow: document.body.style.overflow,
  inert: document.getElementById("app-root")?.hasAttribute("inert"),
  focus: document.activeElement?.tagName,
  focusLabel: document.activeElement?.getAttribute("aria-label") ?? "",
}));
t("scroll lock released", restored.overflow !== "hidden", restored.overflow);
t("inert removed", restored.inert === false);
t(
  "focus returned to the photo you ended on",
  restored.focus === "BUTTON" &&
    restored.focusLabel.includes(`${lightboxIdx + 1} of 6`),
  `${restored.focus} "${restored.focusLabel}" (expected photo ${lightboxIdx + 1})`,
);

// --- 7. click-outside closes ---------------------------------------------
await page.evaluate(() => {
  const slides = document.querySelectorAll(
    '[aria-label="Running photos"] [aria-roledescription="slide"]',
  );
  const btn = [...slides].find((s) => !s.hasAttribute("inert")).querySelector("button");
  // Focus first: a bare .click() does not move focus, but a real click does,
  // and focus-restore-on-close is only meaningful if something had focus.
  btn.focus();
  btn.click();
});
await sleep(600);
await page.mouse.click(60, 60);
await sleep(700);
t("click-outside closes", !(await page.$('[role="dialog"]')));

// --- 8. choose-your-path door --------------------------------------------
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(300);
await page.evaluate(() => {
  [...document.querySelectorAll("#choose a")]
    .find((a) => a.getAttribute("href") === "#fun")
    .click();
});
await sleep(1800);
const landed = await page.evaluate(() => {
  const fun = document.getElementById("fun").getBoundingClientRect().top;
  return { top: Math.round(fun), hash: location.hash };
});
t("door scrolls to #fun", Math.abs(landed.top) < 180, `top=${landed.top}`);
t("door updates the hash", landed.hash === "#fun", landed.hash);

console.log("PASS:");
for (const p of pass) console.log("  ✓ " + p);
console.log("FAIL:");
for (const f of fail) console.log("  ✗ " + f);
console.log("page errors:", errs.length ? errs : "none");
await browser.close();
process.exit(fail.length ? 1 : 0);
