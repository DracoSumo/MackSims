#!/usr/bin/env node
/**
 * Capture Google Play store graphics for tier-3 MackSims apps.
 *
 * Usage:
 *   node scripts/capture-play-store-screens.mjs [app|all] [phone|tablets|all]
 *
 * Examples:
 *   node scripts/capture-play-store-screens.mjs all            # phone + tablets + icon/feature
 *   node scripts/capture-play-store-screens.mjs all tablets    # tablet-7 + tablet-10 only
 *   node scripts/capture-play-store-screens.mjs curbcue phone  # one app, phone only
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "docs", "store-launch", "play-assets");

const FORM_FACTORS = {
  phone: {
    dir: "phone",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1080 / 390,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  },
  "tablet-7": {
    dir: "tablet-7",
    viewport: { width: 800, height: 1280 },
    deviceScaleFactor: 1080 / 800,
    isMobile: false,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },
  "tablet-10": {
    dir: "tablet-10",
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },
};

const APPS = {
  curbcue: {
    playName: "Curbcue",
    theme: "#006d77",
    accent: "#e9c46a",
    base: "https://fairshare-v03-20260624.netlify.app",
    prep: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem("fairshare.betaAcknowledged.v1", JSON.stringify(true));
      });
    },
    shots: [
      { name: "01-compare", path: "/compare" },
      { name: "02-crowd-meter", path: "/crowd-meter" },
      { name: "03-settings", path: "/settings" },
      { name: "04-saved", path: "/saved" },
    ],
  },
  motocrew: {
    playName: "ThrottleLink",
    theme: "#1a1a2e",
    accent: "#e94560",
    base: "https://motocrewz.netlify.app",
    prep: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem("motocrew.safetyAcknowledged", JSON.stringify(true));
      });
    },
    shots: [
      { name: "01-home", path: "/" },
      { name: "02-rides", path: "/", click: "Rides" },
      { name: "03-map", path: "/", click: "Map" },
      { name: "04-safety", path: "/", click: "Safety" },
    ],
  },
  coachcore: {
    playName: "CoachCore",
    theme: "#0f172a",
    accent: "#38bdf8",
    base: "https://coachcore7.netlify.app",
    prep: async (page) => {
      await page.evaluate(() => {
        sessionStorage.setItem("coachcore.demoWalkthroughDismissed", "1");
      });
    },
    shots: [
      { name: "01-landing", path: "/" },
      { name: "02-dashboard", path: "/app" },
      { name: "03-accountability", path: "/app/accountability" },
      { name: "04-training", path: "/app/training" },
      { name: "05-chat", path: "/app/chat" },
    ],
  },
  sermonstudio: {
    playName: "Sermon Studio",
    theme: "#2d1b4e",
    accent: "#c9a227",
    base: "https://sermon-studio-beta.netlify.app",
    prep: async () => {},
    shots: [
      { name: "01-dashboard", path: "/" },
      { name: "02-scripture", path: "/", click: "Scripture" },
      { name: "03-ideas", path: "/", click: "Ideas" },
      { name: "04-series", path: "/", click: "Series" },
    ],
  },
};

function resolveTargets(formArg) {
  const mode = (formArg || "all").toLowerCase();
  if (mode === "phone") return ["phone"];
  if (mode === "tablets" || mode === "tablet") return ["tablet-7", "tablet-10"];
  return ["phone", "tablet-7", "tablet-10"];
}

async function captureShot(page, base, shot) {
  await page.goto(`${base}${shot.path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  if (shot.click) {
    const tab = page
      .getByRole("button", { name: shot.click })
      .or(page.getByRole("tab", { name: shot.click }))
      .or(page.getByRole("link", { name: shot.click }));
    if (await tab.count()) {
      await tab.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
    }
  }
  return page.screenshot({ type: "png" });
}

async function primeSession(page, base, prep) {
  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await prep(page);
  await page.reload({ waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(600);
}

async function renderBrandedAsset(page, { width, height, playName, theme, accent, kind }) {
  const html = `<!DOCTYPE html><html><body style="margin:0;font-family:system-ui,sans-serif;">
  <div id="root" style="width:${width}px;height:${height}px;background:linear-gradient(135deg,${theme},#111);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
    <div style="font-size:${kind === "icon" ? 120 : 64}px;font-weight:800;letter-spacing:-1px;">${playName}</div>
    <div style="margin-top:${kind === "icon" ? 24 : 16}px;font-size:${kind === "icon" ? 28 : 32}px;color:${accent};">${kind === "icon" ? "MackSims" : "External beta · MackSims"}</div>
  </div></body></html>`;
  await page.setViewportSize({ width, height });
  await page.setContent(html);
  return page.screenshot({ type: "png" });
}

async function captureFormFactor(browser, key, config, factorKey) {
  const factor = FORM_FACTORS[factorKey];
  const outDir = path.join(OUT_ROOT, key, factor.dir);
  await mkdir(outDir, { recursive: true });

  const context = await browser.newContext({
    locale: "en-US",
    viewport: factor.viewport,
    deviceScaleFactor: factor.deviceScaleFactor,
    isMobile: factor.isMobile,
    hasTouch: factor.hasTouch,
    userAgent: factor.userAgent,
  });
  const page = await context.newPage();
  await primeSession(page, config.base, config.prep);

  for (const shot of config.shots) {
    const bytes = await captureShot(page, config.base, shot);
    const file = path.join(outDir, `${shot.name}.png`);
    await writeFile(file, bytes);
    console.log(`  ${factor.dir}`, file);
  }

  await context.close();
}

async function captureBrandedAssets(browser, key, config) {
  const outDir = path.join(OUT_ROOT, key);
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();

  const iconBytes = await renderBrandedAsset(page, {
    width: 512,
    height: 512,
    playName: config.playName,
    theme: config.theme,
    accent: config.accent,
    kind: "icon",
  });
  await writeFile(path.join(outDir, "icon-512.png"), iconBytes);
  console.log("  icon", path.join(outDir, "icon-512.png"));

  const featureBytes = await renderBrandedAsset(page, {
    width: 1024,
    height: 500,
    playName: config.playName,
    theme: config.theme,
    accent: config.accent,
    kind: "feature",
  });
  await writeFile(path.join(outDir, "feature-1024x500.png"), featureBytes);
  console.log("  feature", path.join(outDir, "feature-1024x500.png"));

  await context.close();
}

async function captureApp(browser, key, config, targets) {
  for (const factorKey of targets) {
    await captureFormFactor(browser, key, config, factorKey);
  }

  const includeBranded = targets.includes("phone");
  if (includeBranded) {
    await captureBrandedAssets(browser, key, config);
  }

  await writeFile(
    path.join(OUT_ROOT, key, "manifest.json"),
    JSON.stringify(
      {
        app: key,
        capturedAt: new Date().toISOString(),
        formFactors: targets,
        shots: config.shots,
      },
      null,
      2,
    ),
  );
}

async function main() {
  const appArg = (process.argv[2] || "all").toLowerCase();
  const formArg = process.argv[3] || "all";
  const keys = appArg === "all" ? Object.keys(APPS) : [appArg];
  const targets = resolveTargets(formArg);

  for (const k of keys) {
    if (!APPS[k]) {
      console.error(`Unknown app: ${k}`);
      process.exit(1);
    }
  }

  const { chromium } = await import("playwright");
  console.log("Installing/using Playwright chromium…");
  console.log(`Form factors: ${targets.join(", ")}`);
  const browser = await chromium.launch();

  for (const key of keys) {
    console.log(`\n=== ${key} ===`);
    await captureApp(browser, key, APPS[key], targets);
  }

  await browser.close();
  console.log("\nDone →", OUT_ROOT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
