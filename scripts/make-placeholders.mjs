/**
 * Generates placeholder imagery so the layout can be judged before real photos
 * exist. Run with `node scripts/make-placeholders.mjs`.
 *
 * These are stand-ins, not art. Delete the whole /public/images tree and drop
 * your own JPGs in with the same filenames when you have them — nothing in the
 * app depends on these being SVG.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Palette hues, kept in the site's range so placeholders do not fight it. */
const swatches = {
  navy: ["#1B3A6B", "#4E7BC4"],
  violet: ["#6B46C8", "#A98BEE"],
  magenta: ["#C4407A", "#EE8FB6"],
  teal: ["#1F7A8C", "#6FC2CE"],
  amber: ["#B4762A", "#E5B872"],
};

function svg({ w, h, label, swatch, seed }) {
  const [a, b] = swatches[swatch];
  const r = (n) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

  const blobs = Array.from({ length: 4 }, (_, i) => {
    const cx = Math.round(r(i) * w);
    const cy = Math.round(r(i + 10) * h);
    const rad = Math.round((0.3 + r(i + 20) * 0.35) * Math.max(w, h));
    const fill = i % 2 === 0 ? a : b;
    const op = (0.18 + r(i + 30) * 0.22).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" opacity="${op}"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${Math.round(Math.max(w, h) / 12)}"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="#E8EDF5"/>
  <g filter="url(#soft)">${blobs}</g>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
    font-family="ui-sans-serif, system-ui, sans-serif" font-size="${Math.round(Math.min(w, h) / 18)}"
    fill="#0F1B2E" opacity="0.42" letter-spacing="0.5">${label}</text>
</svg>`;
}

const files = [
  // Projects
  ["projects/drone-detection-cover.svg", 1600, 1000, "Edge AI drone detection", "navy"],
  ["projects/drone-detection-1.svg", 1200, 900, "Detection · placeholder", "navy"],
  ["projects/drone-detection-2.svg", 1200, 900, "Detection · placeholder", "teal"],
  ["projects/venture-cover.svg", 1200, 900, "Venture portfolio", "violet"],
  ["projects/venture-1.svg", 1200, 900, "Venture · placeholder", "violet"],
  ["projects/triathlon-cover.svg", 1200, 900, "Triathlon training site", "teal"],
  ["projects/triathlon-1.svg", 1200, 900, "Training · placeholder", "teal"],
  ["projects/coverage-cover.svg", 900, 1200, "Blacksburg coverage", "magenta"],
  ["projects/coverage-1.svg", 1200, 900, "Coverage · placeholder", "magenta"],
  ["projects/drone-build-cover.svg", 1200, 900, "Racing drone build", "amber"],
  ["projects/drone-build-1.svg", 1200, 900, "Build · placeholder", "amber"],
  ["projects/drone-build-2.svg", 1200, 900, "Build · placeholder", "navy"],
  ["projects/gaggia-cover.svg", 1600, 1000, "Gaggia Classic mods", "amber"],
  ["projects/gaggia-1.svg", 1200, 900, "Gaggia · placeholder", "amber"],
  ["projects/gaggia-2.svg", 1200, 900, "Gaggia · placeholder", "magenta"],

  // Hobbies
  ["hobbies/travel-cover.svg", 2100, 900, "Travel", "teal"],
  ["hobbies/triathlon-cover.svg", 1200, 900, "Triathlon", "violet"],
  ["hobbies/running-cover.svg", 1200, 900, "Running", "magenta"],
  ["hobbies/food-cover.svg", 1200, 900, "Food", "amber"],

  // Travel photos
  ["travel/iceland-1.svg", 1200, 900, "Iceland · placeholder", "teal"],
  ["travel/japan-1.svg", 1200, 900, "Japan · placeholder", "magenta"],

  // Portrait
  ["portrait/portrait.svg", 1000, 1250, "Portrait", "navy"],
];

files.forEach(([path, w, h, label, swatch], i) => {
  const out = join(root, "public/images", path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg({ w, h, label, swatch, seed: i + 1 }));
});

console.log(`Wrote ${files.length} placeholder images to public/images/`);
