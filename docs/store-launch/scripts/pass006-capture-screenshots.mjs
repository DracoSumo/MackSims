/**
 * Pass 006 local screenshot capture — FishCrew static + ShutterBid Next dev.
 * Viewport-only at 1242x2688. No uploads.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(path.join(process.cwd(), "package.json"));
const { chromium } = require("@playwright/test");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1242;
const HEIGHT = 2688;
const SIZE_TAG = `${WIDTH}x${HEIGHT}`;

const fishcrewBase = process.env.FISHCREW_BASE_URL || "http://127.0.0.1:8765";
const shutterbidBase = process.env.SHUTTERBID_BASE_URL || "http://127.0.0.1:3000";

const docsRoot = path.resolve(__dirname, "..");
const outputs = {
  fishcrewApple: path.join(docsRoot, "apps/fishcrew/screenshots/apple"),
  fishcrewPlay: path.join(docsRoot, "apps/fishcrew/screenshots/google-play"),
  shutterbidApple: path.join(docsRoot, "apps/shutterbid/screenshots/apple"),
  shutterbidPlay: path.join(docsRoot, "apps/shutterbid/screenshots/google-play"),
};

for (const dir of Object.values(outputs)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fishcrewScenes = [
  { scene: "home-local-fishing-hub", url: `${fishcrewBase}/?screenshot=1&screen=home` },
  { scene: "explore-local-water", url: `${fishcrewBase}/?screenshot=1&screen=explore` },
  { scene: "feed-trip-activity", url: `${fishcrewBase}/?screenshot=1&screen=feed` },
];

const shutterbidScenes = [
  { scene: "marketplace-home", url: `${shutterbidBase}/`, prep: null },
  { scene: "job-detail-venue-content", url: `${shutterbidBase}/jobs/venue-content-package`, prep: null },
  {
    scene: "client-post-job",
    url: `${shutterbidBase}/post-job`,
    prep: async (page) => {
      await page.fill('input[placeholder="Job title"]', "Venue content package");
      await page.fill(
        'textarea[placeholder*="Describe the shoot"]',
        "Recurring social media content, interior details, and event-ready imagery for a Tampa Bay venue."
      );
      await page.fill('input[placeholder="Minimum budget"]', "500");
      await page.fill('input[placeholder="Maximum budget"]', "2000");
    },
  },
];

function rejectPatterns() {
  return [
    /site not found/i,
    /\bBETA\b/,
    /testing an early/i,
    /you are testing/i,
    /should show verification, portfolio fit/i,
    /portfolio examples should sit directly/i,
    /shutterbid should make clients feel/i,
  ];
}

function evaluateStatus(bodyText, actualSize) {
  const visibleIssues = [];
  for (const pattern of rejectPatterns()) {
    if (pattern.test(bodyText)) visibleIssues.push(`Matched ${pattern}`);
  }
  const [w, h] = actualSize.split(" x ").map(Number);
  const accepted =
    (w === 1242 && h === 2688) ||
    (w === 1284 && h === 2778) ||
    (w === 2688 && h === 1242) ||
    (w === 2778 && h === 1284);
  if (!accepted) visibleIssues.push(`Non-accepted size ${actualSize}`);

  const status =
    /site not found/i.test(bodyText)
      ? "REJECT"
      : visibleIssues.length
        ? "NEEDS RETAKE"
        : "READY";
  return { status, visibleIssues };
}

async function captureScene(page, { app, scene, url, prep, appleDir, playDir }) {
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  if (prep) await prep(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const tempPath = path.join(appleDir, `_temp-${app}-${scene}-${SIZE_TAG}.png`);

  await page.screenshot({ path: tempPath, fullPage: false });

  let actualSize = `${WIDTH} x ${HEIGHT}`;
  try {
    const buf = fs.readFileSync(tempPath);
    if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      actualSize = `${width} x ${height}`;
    }
  } catch (_) {}

  const { status, visibleIssues } = evaluateStatus(bodyText, actualSize);
  const prefix = status === "READY" ? "READY" : status === "REJECT" ? "REJECT" : "NEEDS_RETAKE";
  const suffix =
    status === "READY"
      ? ""
      : `-${(visibleIssues[0] || "store-unsafe").replace(/[^a-z0-9]+/gi, "-").slice(0, 48)}`;
  const fileBase = `${prefix}-${app}-${scene}${suffix}-${SIZE_TAG}.png`;
  const applePathFinal = path.join(appleDir, fileBase);
  const playPathFinal = path.join(playDir, fileBase);
  fs.renameSync(tempPath, applePathFinal);
  fs.copyFileSync(applePathFinal, playPathFinal);

  const reason =
    status === "READY"
      ? "Store-safe viewport capture at accepted Apple size"
      : visibleIssues.join("; ") || "Visible store-unsafe content";

  return { app, scene, applePath: applePathFinal, playPath: playPathFinal, actualSize, status, reason, visibleIssues };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  await context.addInitScript(() => {
    try {
      localStorage.setItem("shutterbid_camera_splash_seen_v2", "true");
      localStorage.setItem("shutterbid_camera_splash_seen", "true");
      sessionStorage.setItem("shutterbid_camera_splash_seen", "true");
    } catch (_) {}
  });

  const page = await context.newPage();
  const results = [];

  for (const scene of fishcrewScenes) {
    results.push(
      await captureScene(page, {
        app: "fishcrew",
        ...scene,
        appleDir: outputs.fishcrewApple,
        playDir: outputs.fishcrewPlay,
      })
    );
  }

  for (const scene of shutterbidScenes) {
    results.push(
      await captureScene(page, {
        app: "shutterbid",
        ...scene,
        appleDir: outputs.shutterbidApple,
        playDir: outputs.shutterbidPlay,
      })
    );
  }

  await browser.close();

  const reportPath = path.join(docsRoot, "pass006-capture-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
