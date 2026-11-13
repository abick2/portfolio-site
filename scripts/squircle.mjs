/**
 * Prints the `.squircle-*` mask classes for globals.css. Each frame ratio gets
 * one SVG drawn at that ratio, so stretching it to 100% 100% never distorts.
 * The corner is Apple's continuous curve (Figma's corner smoothing at 60%).
 * The portrait keeps the icon radius of 22.37% of the shorter side; on wide
 * landscape frames that reads as a pill, so they get a softer radius.
 *
 *   node scripts/squircle.mjs
 */
/** [width, height, radius as a fraction of the shorter side] */
const RATIOS = {
  "4x3": [4, 3, 0.1],
  "16x9": [16, 9, 0.1],
  "4x5": [4, 5, 0.2237],
};
const SMOOTHING = 0.6;

const rad = (deg) => (deg * Math.PI) / 180;
const n = (x) => Number(x.toFixed(3));

function squirclePath(w, h, radius) {
  const r = radius * Math.min(w, h);
  const p = Math.min((1 + SMOOTHING) * r, Math.min(w, h) / 2);
  const arcMeasure = 90 * (1 - SMOOTHING);
  const arc = n(Math.sin(rad(arcMeasure / 2)) * r * Math.SQRT2);
  const alpha = (90 - arcMeasure) / 2;
  const beta = 45 * SMOOTHING;
  const p3ToP4 = r * Math.tan(rad(alpha / 2));
  const c = n(p3ToP4 * Math.cos(rad(beta)));
  const d = n(c * Math.tan(rad(beta)));
  const b = n((p - arc - c - d) / 3);
  const a = n(2 * b);
  const ab = n(a + b);
  const bc = n(b + c);
  const abc = n(a + b + c);
  const R = n(r);
  const P = n(p);
  return [
    `M${w - P} 0`,
    `c${a} 0 ${ab} 0 ${abc} ${d}a${R} ${R} 0 0 1 ${arc} ${arc}c${d} ${c} ${d} ${bc} ${d} ${abc}`,
    `L${w} ${h - P}`,
    `c0 ${a} 0 ${ab} ${-d} ${abc}a${R} ${R} 0 0 1 ${-arc} ${arc}c${-c} ${d} ${-bc} ${d} ${-abc} ${d}`,
    `L${P} ${h}`,
    `c${-a} 0 ${-ab} 0 ${-abc} ${-d}a${R} ${R} 0 0 1 ${-arc} ${-arc}c${-d} ${-c} ${-d} ${-bc} ${-d} ${-abc}`,
    `L0 ${P}`,
    `c0 ${-a} 0 ${-ab} ${d} ${-abc}a${R} ${R} 0 0 1 ${arc} ${-arc}c${c} ${-d} ${bc} ${-d} ${abc} ${-d}Z`,
  ].join("");
}

for (const [name, [rw, rh, radius]] of Object.entries(RATIOS)) {
  const w = rw * 100;
  const h = rh * 100;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path d='${squirclePath(w, h, radius)}'/></svg>`;
  console.log(`  .squircle-${name} {
    mask: url("data:image/svg+xml,${svg.replaceAll("<", "%3C").replaceAll(">", "%3E")}")
      0 0 / 100% 100% no-repeat;
  }`);
}
