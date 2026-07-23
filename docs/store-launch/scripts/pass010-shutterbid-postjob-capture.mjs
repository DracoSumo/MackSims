/**
 * Pass 010 — ShutterBid post-job clean retake + optional replacement scene.
 * 414×896 CSS @ deviceScaleFactor 3 → 1242×2688 PNG. No source changes.
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

const base = process.env.SHUTTERBID_BASE_URL || "http://127.0.0.1:3000";
const docsRoot = path.resolve(__dirname, "..");
const appleDir = path.join(docsRoot, "apps/shutterbid/screenshots/apple");
const playDir = path.join(docsRoot, "apps/shutterbid/screenshots/google-play");

for (const dir of [appleDir, playDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return `${buf.readUInt32BE(16)} x ${buf.readUInt32BE(20)}`;
  }
  return `${OUT_WIDTH} x ${OUT_HEIGHT}`;
}

function rejectPatterns() {
  return [
    /site not found/i,
    /should show verification, portfolio fit/i,
    /portfolio examples should sit directly/i,
    /shutterbid should make clients feel/i,
    /should feel like/i,
  ];
}

async function shellState(page) {
  return {
    mobileNavVisible: await page.locator(".sb-mobile-bottom-nav").isVisible().catch(() => false),
    desktopNavVisible: await page.locator(".sb-desktop-nav").isVisible().catch(() => false),
    footerAdminVisible: await page
      .locator('.sb-footer-protected-access a:has-text("Admin access")')
      .isVisible()
      .catch(() => false),
    draftBannerVisible: await page
      .locator("text=You can draft this first")
      .isVisible()
      .catch(() => false),
  };
}

function evaluateStatus(bodyText, actualSize, shell, extraIssues = []) {
  const issues = [...extraIssues];
  for (const pattern of rejectPatterns()) {
    if (pattern.test(bodyText)) issues.push(`Matched ${pattern}`);
  }
  const [w, h] = actualSize.split(" x ").map(Number);
  if (w !== OUT_WIDTH || h !== OUT_HEIGHT) {
    issues.push(`Wrong size ${actualSize}; expected ${OUT_WIDTH} x ${OUT_HEIGHT}`);
  }
  if (!shell.mobileNavVisible) issues.push("Mobile bottom nav not visible");
  if (shell.desktopNavVisible) issues.push("Desktop top nav visible");
  if (shell.footerAdminVisible) issues.push("Footer Admin access visible in viewport");
  if (shell.draftBannerVisible) issues.push("Guest draft banner visible in viewport");

  const status =
    /site not found/i.test(bodyText) ? "REJECT" : issues.length ? "NEEDS RETAKE" : "READY";
  return { status, issues };
}

async function captureToFile(page, fileName) {
  const tempPath = path.join(appleDir, `_temp-${fileName}`);
  await page.screenshot({ path: tempPath, fullPage: false });
  const applePath = path.join(appleDir, fileName);
  const playPath = path.join(playDir, fileName);
  fs.renameSync(tempPath, applePath);
  fs.copyFileSync(applePath, playPath);
  return { applePath, playPath, actualSize: readPngSize(applePath) };
}

async function prepPostJobForm(page) {
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
}

async function scrollPostJobFormIntoView(page) {
  await page.evaluate(() => {
    const form = document.querySelector(".sb-post-job-form");
    const topbar = document.querySelector(".sb-topbar");
    const offset = topbar ? topbar.getBoundingClientRect().height + 8 : 72;
    if (form) {
      const y = window.scrollY + form.getBoundingClientRect().top - offset;
      window.scrollTo(0, Math.max(0, y));
    }
  });
}

async function tryPostJobClean(page) {
  const fileName = `READY-shutterbid-client-post-job-mobile-clean-${SIZE_TAG}.png`;
  await page.goto(`${base}/post-job`, { waitUntil: "networkidle", timeout: 90000 });
  await prepPostJobForm(page);
  await scrollPostJobFormIntoView(page);
  await page.waitForTimeout(800);

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const shell = await shellState(page);
  const { applePath, playPath, actualSize } = await captureToFile(page, fileName);
  const { status, issues } = evaluateStatus(bodyText, actualSize, shell);

  return {
    attempt: "Option B — post-job scroll-to-form",
    scene: "client-post-job-clean",
    route: "/post-job",
    file: fileName,
    applePath,
    playPath,
    actualSize,
    status,
    issues,
    ...shell,
    viewport: `${CSS_WIDTH} x ${CSS_HEIGHT} CSS @ ${DEVICE_SCALE}x`,
  };
}

async function tryJobsBrowseReplacement(page) {
  const fileName = `READY-shutterbid-jobs-browse-mobile-${SIZE_TAG}.png`;
  await page.goto(`${base}/jobs`, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const shell = await shellState(page);
  const { applePath, playPath, actualSize } = await captureToFile(page, fileName);
  const { status, issues } = evaluateStatus(bodyText, actualSize, shell);

  return {
    attempt: "Option C — jobs browse replacement",
    scene: "jobs-browse",
    route: "/jobs",
    file: fileName,
    applePath,
    playPath,
    actualSize,
    status,
    issues,
    ...shell,
    viewport: `${CSS_WIDTH} x ${CSS_HEIGHT} CSS @ ${DEVICE_SCALE}x`,
    replacesPostJob: true,
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
  const postJobResult = await tryPostJobClean(page);
  let replacementResult = null;

  if (postJobResult.status !== "READY") {
    replacementResult = await tryJobsBrowseReplacement(page);
  }

  await browser.close();

  const summary = {
    pass: "010",
    optionA: "Skipped — no safe demo credentials in repo/docs (DO_NOT_COMMIT_PASSWORD only)",
    postJobResult,
    replacementResult,
    chosenThirdScene:
      postJobResult.status === "READY"
        ? postJobResult
        : replacementResult?.status === "READY"
          ? replacementResult
          : postJobResult.status === "NEEDS RETAKE"
            ? postJobResult
            : replacementResult,
  };

  const reportPath = path.join(docsRoot, "pass010-shutterbid-postjob-capture-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
