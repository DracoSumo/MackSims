#!/usr/bin/env node
/**
 * Concurrent HTTP smoke against live Netlify portfolio URLs.
 * GET only; exit 0 if >= 95% of requests succeed (2xx/3xx).
 */
const TARGETS = [
  { name: "FairShare", url: "https://fairshare-v03-20260624.netlify.app/" },
  { name: "MotoCrew", url: "https://motocrewz.netlify.app/" },
  { name: "CoachCore", url: "https://coachcore7.netlify.app/app/" },
  { name: "SermonStudio", url: "https://sermon-studio-beta.netlify.app/" },
];

const REQUESTS_PER_TARGET = 100;
const CONCURRENCY = 20;
const SUCCESS_THRESHOLD = 0.95;

async function fetchOnce(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "text/html,application/xhtml+xml,*/*" },
    });
    return { ok: res.status >= 200 && res.status < 400, status: res.status, ms: Date.now() - started };
  } catch (err) {
    return { ok: false, status: 0, ms: Date.now() - started, error: String(err?.message || err) };
  }
}

async function runPool(url, total, concurrency) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < total) {
      const i = next++;
      results[i] = await fetchOnce(url);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

function summarize(name, results) {
  const byStatus = new Map();
  let ok = 0;
  for (const r of results) {
    byStatus.set(r.status, (byStatus.get(r.status) || 0) + 1);
    if (r.ok) ok++;
  }
  const rate = ok / results.length;
  const statusLine = [...byStatus.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([code, n]) => `${code}:${n}`)
    .join(" ");
  return { name, ok, total: results.length, rate, statusLine };
}

async function main() {
  console.log(
    `swarm-smoke: ${TARGETS.length} targets × ${REQUESTS_PER_TARGET} GET, concurrency ${CONCURRENCY}\n`,
  );

  const summaries = [];
  for (const target of TARGETS) {
    process.stdout.write(`→ ${target.name} ${target.url} … `);
    const results = await runPool(target.url, REQUESTS_PER_TARGET, CONCURRENCY);
    const summary = summarize(target.name, results);
    summaries.push(summary);
    console.log(
      `${summary.ok}/${summary.total} ok (${(summary.rate * 100).toFixed(1)}%) [${summary.statusLine}]`,
    );
  }

  const totalOk = summaries.reduce((s, x) => s + x.ok, 0);
  const totalReq = summaries.reduce((s, x) => s + x.total, 0);
  const overall = totalOk / totalReq;

  console.log("\n── summary ──");
  for (const s of summaries) {
    console.log(
      `${s.name.padEnd(14)} ${String(s.ok).padStart(3)}/${s.total}  ${(s.rate * 100).toFixed(1)}%  ${s.statusLine}`,
    );
  }
  console.log(
    `\noverall ${totalOk}/${totalReq} (${(overall * 100).toFixed(1)}%) — threshold ${(SUCCESS_THRESHOLD * 100).toFixed(0)}%`,
  );

  if (overall < SUCCESS_THRESHOLD) {
    console.error("FAIL: success rate below threshold");
    process.exit(1);
  }
  console.log("PASS");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
