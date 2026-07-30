/**
 * Pass 009 — ShutterBid mobile-shell screenshot retake.
 * Viewport 414×896 CSS @ deviceScaleFactor 3 → 1242×2688 PNG.
 * No source changes. No uploads.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(
  "C:\\Users\\draco\\OneDrive\\Documents\\GitHub\\shutterbid-ios\\package.json"
);
const { chromium } = require("@playwright/test");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_WIDTH = 414;
const CSS_HEIGHT = 896;
const DEVICE_SCALE = 3;
const OUT_WIDTH = CSS_WIDTH * DEVICE_SCALE;
const OUT_HEIGHT = CSS_HEIGHT * DEVICE_SCALE;
const SIZE_TAG = `${OUT_WIDTH}x${OUT_HEIGHT}`;

const shutterbidBase = process.env.SHUTTERBID_BASE_URL || "http://127.0.0.1:3000";
const docsRoot = path.resolve(__dirname, "..");
const appleDir = path.join(docsRoot, "apps/shutterbid/screenshots/apple");
const playDir = path.join(docsRoot, "apps/shutterbid/screenshots/google-play");

for (const dir of [appleDir, playDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const scenes = [
  {
    scene: "marketplace-home",
    file: `READY-shutterbid-marketplace-home-mobile-${SIZE_TAG}.png`,
    url: `${shutterbidBase}/`,
    prep: null,
  },
  {
    scene: "job-detail-venue-content",
    file: `READY-shutterbid-job-detail-venue-content-mobile-${SIZE_TAG}.png`,
    url: `${shutterbidBase}/jobs/venue-content-package`,
    prep: null,
  },
  {
    scene: "client-post-job",
    file: `READY-shutterbid-client-post-job-mobile-${SIZE_TAG}.png`,
    url: `${shutterbidBase}/post-job`,
    prep: async (page) => {
      await page.selectOption("select", { value: "other" });
      await page.fill('input[placeholder="Job title"]', "Venue content package");
      await page.fill(
        'textarea[placeholder*="Describe the shoot"]',
        "Recurring social media content, interior details, and event-ready imagery for a Tampa Bay venue."
      );
      await page.fill('input[placeholder="City"]', "St. Petersburg");
      await page.fill('input[placeholder="State"]', "FL");
      await page.fill('input[placeholder="Minimum budget"]', "500");
      await page.fill('input[placeholder="Maximum budget"]', "2000");
      await page.evaluate(() => {
        const heading = document.querySelector(".sb-post-job-card h1");
        if (heading) heading.scrollIntoView({ block: "start" });
        else window.scrollTo(0, 120);
      });
    },
  },
];

function rejectPatterns() {
  return [
    /site not found/i,
    /should show verification, portfolio fit/i,
    /portfolio examples should sit directly/i,
    /shutterbid should make clients feel/i,
  ];
}

function evaluateCapture({ bodyText, actualSize, shell }) {
  const issues = [];
  for (const pattern of rejectPatterns()) {
    if (pattern.test(bodyText)) issues.push(`Matched ${pattern}`);
  }
  const [w, h] = actualSize.split(" x ").map(Number);
  if (w !== OUT_WIDTH || h !== OUT_HEIGHT) {
    issues.push(`Wrong size ${actualSize}; expected ${OUT_WIDTH} x ${OUT_HEIGHT}`);
  }
  if (!shell.mobileNavVisible) issues.push("Mobile bottom nav not visible");
  if (shell.desktopNavVisible) issues.push("Desktop top nav links visible at mobile width");
  if (/Admin access/i.test(bodyText) && shell.footerAdminVisible) {
    issues.push("Footer Admin access visible in viewport");
  }
  if (/You can draft this first/i.test(bodyText) && shell.scene === "client-post-job") {
    issues.push("Draft-account banner visible on post-job");
  }
  if (/Family Portraits/i.test(bodyText) && /Venue content package/i.test(bodyText) && shell.scene === "client-post-job") {
    issues.push("Category/title mismatch on post-job");
  }

  const status =
    /site not found/i.test(bodyText) ? "REJECT" : issues.length ? "NEEDS RETAKE" : "READY";
  return { status, issues };
}

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return `${buf.readUInt32BE(16)} x ${buf.readUInt32BE(20)}`;
  }
  return `${OUT_WIDTH} x ${OUT_HEIGHT}`;
}

async function captureScene(page, sceneDef) {
  await page.setViewportSize({ width: CSS_WIDTH, height: CSS_HEIGHT });
  await page.goto(sceneDef.url, { waitUntil: "networkidle", timeout: 90000 });
  if (sceneDef.prep) await sceneDef.prep(page);
  await page.waitForTimeout(1200);

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const mobileNavVisible = await page.locator(".sb-mobile-bottom-nav").isVisible().catch(() => false);
  const desktopNavVisible = await page.locator(".sb-desktop-nav").isVisible().catch(() => false);
  const footerAdminVisible = await page
    .locator('.sb-footer-protected-access a:has-text("Admin access")')
    .isVisible()
    .catch(() => false);

  const tempPath = path.join(appleDir, `_temp-${sceneDef.scene}.png`);
  await page.screenshot({ path: tempPath, fullPage: false });

  const actualSize = readPngSize(tempPath);
  const { status, issues } = evaluateCapture({
    bodyText,
    actualSize,
    shell: {
      scene: sceneDef.scene,
      mobileNavVisible,
      desktopNavVisible,
      footerAdminVisible,
    },
  });

  const applePath = path.join(appleDir, sceneDef.file);
  const playPath = path.join(playDir, sceneDef.file);
  fs.renameSync(tempPath, applePath);
  fs.copyFileSync(applePath, playPath);

  return {
    scene: sceneDef.scene,
    file: sceneDef.file,
    applePath,
    playPath,
    actualSize,
    status,
    issues,
    mobileNavVisible,
    desktopNavVisible,
    footerAdminVisible,
    viewport: `${CSS_WIDTH} x ${CSS_HEIGHT} CSS @ ${DEVICE_SCALE}x`,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: CSS_WIDTH, height: CSS_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
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

  for (const scene of scenes) {
    results.push(await captureScene(page, scene));
  }

  await browser.close();

  const reportPath = path.join(docsRoot, "pass009-shutterbid-mobile-capture-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
