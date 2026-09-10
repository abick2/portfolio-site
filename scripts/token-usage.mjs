/**
 * Token accounting for this project's Claude Code sessions.
 *
 *   node scripts/token-usage.mjs           # print a report
 *   node scripts/token-usage.mjs --write   # also append to TOKEN-LOG.md
 *
 * Reads the transcripts Claude Code keeps under ~/.claude/projects/<slug>/,
 * including subagent transcripts under <session>/tasks/, since those are billed
 * too. Totals are grouped by session so cost per working session is visible.
 */

import { createReadStream, readdirSync, statSync, existsSync, appendFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { homedir } from "node:os";

const SLUG = "-Users-andrewbickford-Documents-VSCodeWorkspace-portfolio-site";
const ROOT = join(homedir(), ".claude", "projects", SLUG);

const empty = () => ({ input: 0, output: 0, cacheWrite: 0, cacheRead: 0, msgs: 0 });

function addUsage(acc, u) {
  if (!u) return;
  acc.input      += u.input_tokens ?? 0;
  acc.output     += u.output_tokens ?? 0;
  acc.cacheWrite += u.cache_creation_input_tokens ?? 0;
  acc.cacheRead  += u.cache_read_input_tokens ?? 0;
  acc.msgs       += 1;
}

async function scanFile(path, acc) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    addUsage(acc, o?.message?.usage ?? o?.usage);
  }
}

function walkJsonl(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkJsonl(p, out);
    else if (e.name.endsWith(".jsonl") || e.name.endsWith(".output")) out.push(p);
  }
  return out;
}

if (!existsSync(ROOT)) {
  console.error(`No transcripts found at ${ROOT}`);
  process.exit(1);
}

const sessions = new Map();
for (const file of walkJsonl(ROOT)) {
  // Session id is the top-level .jsonl basename, or the parent dir for subagents.
  const m = file.match(/([0-9a-f-]{36})/);
  const id = m ? m[1] : "unknown";
  if (!sessions.has(id)) sessions.set(id, { acc: empty(), files: [], mtime: 0 });
  const s = sessions.get(id);
  s.files.push(file);
  s.mtime = Math.max(s.mtime, statSync(file).mtimeMs);
  await scanFile(file, s.acc);
}

const fmt = (n) => n.toLocaleString("en-US");
const total = empty();
const rows = [...sessions.entries()].sort((a, b) => a[1].mtime - b[1].mtime);

console.log("\nToken usage by session\n" + "=".repeat(78));
for (const [id, s] of rows) {
  const a = s.acc;
  const billable = a.input + a.output + a.cacheWrite + a.cacheRead;
  for (const k of Object.keys(total)) total[k] += a[k];
  console.log(
    `\n${id}  (${new Date(s.mtime).toISOString().slice(0, 16).replace("T", " ")})\n` +
    `  input ${fmt(a.input).padStart(10)}   output ${fmt(a.output).padStart(9)}\n` +
    `  cache write ${fmt(a.cacheWrite).padStart(10)}   cache read ${fmt(a.cacheRead).padStart(11)}\n` +
    `  assistant messages ${fmt(a.msgs).padStart(6)}   TOTAL ${fmt(billable).padStart(12)}`
  );
}

const grand = total.input + total.output + total.cacheWrite + total.cacheRead;
console.log("\n" + "=".repeat(78));
console.log(`PROJECT TOTAL: ${fmt(grand)} tokens across ${rows.length} session(s)`);
console.log(`  input ${fmt(total.input)} | output ${fmt(total.output)} | cache write ${fmt(total.cacheWrite)} | cache read ${fmt(total.cacheRead)}\n`);

if (process.argv.includes("--write")) {
  const line =
    `| ${new Date().toISOString().slice(0, 10)} | ${rows.length} | ${fmt(total.input)} | ` +
    `${fmt(total.output)} | ${fmt(total.cacheWrite)} | ${fmt(total.cacheRead)} | **${fmt(grand)}** |\n`;
  const f = "TOKEN-LOG.md";
  if (!existsSync(f)) {
    appendFileSync(f,
      "# Token usage log\n\n" +
      "Cumulative Claude Code token usage for this project. Regenerate with\n" +
      "`node scripts/token-usage.mjs --write`.\n\n" +
      "Cache reads are billed at a large discount, so the TOTAL column is raw\n" +
      "token volume, not a cost figure.\n\n" +
      "| Date | Sessions | Input | Output | Cache write | Cache read | Total |\n" +
      "|---|---|---|---|---|---|---|\n");
  }
  appendFileSync(f, line);
  console.log(`Appended to ${f}`);
}
