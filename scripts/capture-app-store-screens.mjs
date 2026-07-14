#!/usr/bin/env node
/**
 * Capture App Store Connect graphics for tier-3 MackSims apps.
 *
 * Usage:
 *   node scripts/capture-app-store-screens.mjs [app|all] [iphone|ipad|all]
 *
 * Outputs under docs/store-launch/app-store-assets/<app>/:
 *   iphone-6.7/*.png   — 1290×2796 (6.7" display, required)
 *   ipad-12.9/*.png    — 2048×2732 (12.9" iPad, recommended)
 *   icon-1024.png      — App Store icon (no alpha)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "docs", "store-launch", "app-store-assets");

const FORM_FACTORS = {
  iphone: {
    dir: "iphone-6.7",
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  ipad: {
    dir: "ipad-12.9",
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
};

const APPS = {
  curbcue: {
    storeName: "Curbcue",
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
    storeName: "ThrottleLink",
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
    storeName: "CoachCore",
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
    storeName: "Sermon Studio",
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
  if (mode === "iphone") return ["iphone"];
  if (mode === "ipad") return ["ipad"];
  return ["iphone", "ipad"];
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

async function renderIcon(page, { playName, theme, accent }) {
  const html = `<!DOCTYPE html><html><body style="margin:0;font-family:system-ui,sans-serif;">
  <div style="width:1024px;height:1024px;background:linear-gradient(135deg,${theme},#111);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
    <div style="font-size:120px;font-weight:800;letter-spacing:-1px;">${playName}</div>
    <div style="margin-top:24px;font-size:28px;color:${accent};">MackSims</div>
  </div></body></html>`;
  await page.setViewportSize({ width: 1024, height: 1024 });
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

async function captureIcon(browser, key, config) {
  const outDir = path.join(OUT_ROOT, key);
  await mkdir(outDir, { recursive: true });
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  const bytes = await renderIcon(page, {
    playName: config.storeName,
    theme: config.theme,
    accent: config.accent,
  });
  const file = path.join(outDir, "icon-1024.png");
  await writeFile(file, bytes);
  console.log("  icon-1024", file);
  await context.close();
}

async function captureApp(browser, key, config, targets) {
  for (const factorKey of targets) {
    await captureFormFactor(browser, key, config, factorKey);
  }
  if (targets.includes("iphone")) {
    await captureIcon(browser, key, config);
  }

  await writeFile(
    path.join(OUT_ROOT, key, "manifest.json"),
    JSON.stringify(
      {
        app: key,
        storeName: config.storeName,
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
  console.log("Form factors:", targets.join(", "));
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
