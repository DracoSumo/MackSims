import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** @typedef {{ name: string, viewport: { width: number, height: number }, deviceScaleFactor: number, targetW: number, targetH: number, outDir: (app: string) => string }} Form */

/** @type {Form} */
const PLAY = {
  name: "play",
  viewport: { width: 360, height: 800 },
  deviceScaleFactor: 3,
  targetW: 1080,
  targetH: 2400,
  outDir: (app) => path.join(ROOT, "play-assets", app, "phone"),
};

/** @type {Form} */
const IOS_65 = {
  name: "ios-6.5",
  viewport: { width: 414, height: 896 },
  deviceScaleFactor: 3,
  targetW: 1242,
  targetH: 2688,
  outDir: (app) => path.join(ROOT, "app-store-assets", app, "iphone-6.5"),
};

/** @type {Form} */
const IOS_69 = {
  name: "ios-6.9",
  viewport: { width: 440, height: 956 },
  deviceScaleFactor: 3,
  targetW: 1320,
  targetH: 2868,
  outDir: (app) => path.join(ROOT, "app-store-assets", app, "iphone-6.9"),
};

/** Apple 12.9" iPad Pro portrait — 2048×2732 */
/** @type {Form} */
const IOS_IPAD_129 = {
  name: "ios-ipad-12.9",
  viewport: { width: 1024, height: 1366 },
  deviceScaleFactor: 2,
  targetW: 2048,
  targetH: 2732,
  outDir: (app) => path.join(ROOT, "app-store-assets", app, "ipad-12.9"),
  isTablet: true,
};

const ALL_FORMS = {
  "ios-6.5": IOS_65,
  "ios-6.9": IOS_69,
  play: PLAY,
  "ios-ipad-12.9": IOS_IPAD_129,
  "ipad-12.9": IOS_IPAD_129,
  ipad: IOS_IPAD_129,
};

/** Default: phone packs only (does not overwrite unless --forms includes them). */
const DEFAULT_FORMS = [IOS_65, IOS_69, PLAY];
const SETTLE_MS = 1500;
const NAV_TIMEOUT = 60000;

function parseFormsFromArgs(argv) {
  const formsArg = argv.find((a) => a.startsWith("--forms="));
  if (!formsArg) return DEFAULT_FORMS;
  const keys = formsArg
    .slice("--forms=".length)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const out = [];
  for (const key of keys) {
    const form = ALL_FORMS[key];
    if (!form) {
      console.error(`Unknown form "${key}". Known: ${Object.keys(ALL_FORMS).join(", ")}`);
      process.exit(1);
    }
    if (!out.includes(form)) out.push(form);
  }
  return out;
}

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Not a PNG: ${filePath}`);
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function dismissOverlays(page) {
  const selectors = [
    'button:has-text("I understand — explore the demo")',
    'text=I understand — explore the demo',
    'button:has-text("I understand")',
    'button:has-text("I Understand")',
    'button:has-text("explore the demo")',
    'button:has-text("Got it")',
    'button:has-text("Dismiss")',
    'button:has-text("Skip")',
    'button:has-text("Close")',
    'button:has-text("Accept")',
    'button:has-text("Continue")',
    'button:has-text("OK")',
    'button:has-text("Okay")',
    'button:has-text("Not now")',
    'button:has-text("Keep local only")',
    'button:has-text("Acknowledge")',
    'button:has-text("I Agree")',
    '[aria-label="Close"]',
    '[aria-label="Dismiss"]',
    '[data-close-overlay="onboarding"]',
    'text=Skip tour',
    'text=Skip walkthrough',
  ];
  for (let round = 0; round < 3; round++) {
    for (const sel of selectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 350 }).catch(() => false)) {
          await el.click({ timeout: 2000, force: true }).catch(() => {});
          await page.waitForTimeout(350);
        }
      } catch {
        /* ignore */
      }
    }
    try {
      const backdrop = page.locator('[data-close-overlay="onboarding"], .app-overlay-backdrop').first();
      if (await backdrop.isVisible({ timeout: 200 }).catch(() => false)) {
        await backdrop.click({ force: true }).catch(() => {});
        await page.waitForTimeout(300);
      }
    } catch {
      /* ignore */
    }
  }
}

async function clickText(page, text) {
  const candidates = [
    page.getByRole("link", { name: text, exact: false }),
    page.getByRole("button", { name: text, exact: false }),
    page.getByText(text, { exact: true }),
    page.locator(`a:has-text("${text}")`),
    page.locator(`button:has-text("${text}")`),
    page.locator(`[role="tab"]:has-text("${text}")`),
  ];
  for (const loc of candidates) {
    try {
      const el = loc.first();
      if (await el.isVisible({ timeout: 800 }).catch(() => false)) {
        await el.click({ timeout: 3000 });
        await page.waitForTimeout(SETTLE_MS);
        return true;
      }
    } catch {
      /* try next */
    }
  }
  return false;
}

async function gotoSafe(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT });
  } catch {
    await page.goto(url, { waitUntil: "load", timeout: NAV_TIMEOUT });
  }
  await page.waitForTimeout(SETTLE_MS);
}

async function captureShot(page, outPath, form) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: false, type: "png" });
  const { width, height } = readPngSize(outPath);
  if (width !== form.targetW || height !== form.targetH) {
    // Retry with slightly adjusted viewport to hit exact pixel size
    const adjW = Math.round(form.targetW / form.deviceScaleFactor);
    const adjH = Math.round(form.targetH / form.deviceScaleFactor);
    await page.setViewportSize({ width: adjW, height: adjH });
    await page.waitForTimeout(300);
    await page.screenshot({ path: outPath, fullPage: false, type: "png" });
    const again = readPngSize(outPath);
    if (again.width !== form.targetW || again.height !== form.targetH) {
      throw new Error(
        `Wrong size ${again.width}×${again.height}, want ${form.targetW}×${form.targetH}`
      );
    }
  }
  return { bytes: fs.statSync(outPath).size, width: form.targetW, height: form.targetH };
}

function updateManifest(app) {
  const manifestPath = path.join(ROOT, "play-assets", app, "manifest.json");
  let data = {};
  if (fs.existsSync(manifestPath)) {
    try {
      data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
      data = {};
    }
  }
  data.app = data.app || app;
  data.capturedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2) + "\n");
}

const APPS = [
  {
    id: "coachcore",
    base: "https://coachcore7.netlify.app",
    shots: [
      { name: "01-landing", path: "/" },
      { name: "02-dashboard", path: "/app", before: async (page) => dismissOverlays(page) },
      { name: "03-accountability", path: "/app/accountability", before: async (page) => dismissOverlays(page) },
      { name: "04-training", path: "/app/training", before: async (page) => dismissOverlays(page) },
      { name: "05-chat", path: "/app/chat", before: async (page) => dismissOverlays(page) },
    ],
  },
  {
    id: "curbcue",
    base: "https://fairshare-v03-20260624.netlify.app",
    shots: [
      {
        name: "01-compare",
        path: "/compare",
        fallbackPath: "/",
        fallbackName: "00-home",
        afterNav: async (page) => {
          if (!(await clickText(page, "Compare"))) await clickText(page, "compare");
        },
      },
      {
        name: "02-crowd-meter",
        path: "/crowd-meter",
        afterNav: async (page) => {
          (await clickText(page, "CrowdMeter")) ||
            (await clickText(page, "Crowd Meter")) ||
            (await clickText(page, "Crowd"));
        },
      },
      {
        name: "03-settings",
        path: "/settings",
        afterNav: async (page) => clickText(page, "Settings"),
      },
      {
        name: "04-saved",
        path: "/saved",
        afterNav: async (page) => {
          (await clickText(page, "Saved")) || (await clickText(page, "Home"));
        },
      },
    ],
  },
  {
    id: "motocrew",
    base: "https://motocrewz.netlify.app",
    shots: [
      { name: "01-home", path: "/" },
      {
        name: "02-rides",
        path: "/",
        afterNav: async (page) => {
          await dismissOverlays(page);
          await clickText(page, "Rides");
          await dismissOverlays(page);
        },
      },
      {
        name: "03-map",
        path: "/",
        afterNav: async (page) => {
          await dismissOverlays(page);
          await clickText(page, "Map");
          await dismissOverlays(page);
        },
      },
      {
        name: "04-safety",
        path: "/",
        afterNav: async (page) => {
          await dismissOverlays(page);
          await clickText(page, "Safety");
          await dismissOverlays(page);
        },
      },
    ],
  },
  {
    id: "sermonstudio",
    base: "https://sermon-studio-beta.netlify.app",
    shots: [
      { name: "01-dashboard", path: "/" },
      { name: "02-scripture", path: "/", afterNav: async (page) => clickText(page, "Scripture") },
      { name: "03-ideas", path: "/", afterNav: async (page) => clickText(page, "Ideas") },
      { name: "04-series", path: "/", afterNav: async (page) => clickText(page, "Series") },
    ],
  },
  {
    id: "aegisintel",
    base: "https://sprightly-lily-160925.netlify.app",
    // SPA: deep paths like /watchlist and /settings are Netlify 404s. Stay on /
    // and switch via bottom .app-nav-btn (hash #settings also works for settings).
    shots: [
      {
        name: "01-home",
        path: "/",
        before: async (page) => dismissOverlays(page),
      },
      {
        name: "02-watchlist",
        path: "/",
        before: async (page) => dismissOverlays(page),
        afterNav: async (page) => {
          const btn = page.locator("button.app-nav-btn", { hasText: "Watchlist" }).first();
          if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await btn.click({ force: true });
            await page.waitForTimeout(SETTLE_MS);
          } else {
            await clickText(page, "Watchlist");
          }
        },
      },
      {
        name: "03-settings",
        path: "/#settings",
        before: async (page) => dismissOverlays(page),
        afterNav: async (page) => {
          const body = (await page.locator("body").innerText().catch(() => "")).slice(0, 400);
          if (/PREFERENCES|Research preferences/i.test(body)) return;
          const btn = page.locator("button.app-nav-btn", { hasText: "Settings" }).first();
          if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await btn.click({ force: true });
            await page.waitForTimeout(SETTLE_MS);
          } else {
            await clickText(page, "Settings");
          }
        },
        on404: "home",
      },
    ],
  },
  {
    id: "shutterbid",
    bases: ["https://shutterbid-web.netlify.app", "https://shutterbid.netlify.app"],
    shots: [
      { name: "01-marketplace", path: "/" },
      // Prefer sample brief; /browse 404s. Fall back to marketplace if job slug 404s.
      { name: "02-job-detail", path: "/jobs/venue-content-package", on404: "home" },
      { name: "03-post-job", path: "/post-job", on404: "home" },
    ],
  },
  {
    id: "fishcrew",
    bases: ["https://fishcrew.macksims.com", "https://fishcrew.netlify.app"],
    shots: [
      { name: "01-home", path: "/?screenshot=1&screen=home", fallbackPath: "/" },
      {
        name: "02-explore",
        path: "/?screenshot=1&screen=explore",
        fallbackPath: "/",
        afterNav: async (page) => {
          if (!page.url().includes("explore")) await clickText(page, "Explore");
        },
        fallbackAfter: async (page) => clickText(page, "Explore"),
      },
      {
        name: "03-feed",
        path: "/?screenshot=1&screen=feed",
        fallbackPath: "/",
        afterNav: async (page) => {
          if (!page.url().includes("feed")) await clickText(page, "Feed");
        },
        fallbackAfter: async (page) => clickText(page, "Feed"),
      },
    ],
  },
];

async function resolveBase(browser, bases) {
  const list = Array.isArray(bases) ? bases : [bases];
  for (const base of list) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const resp = await page.goto(base, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      const status = resp?.status() ?? 0;
      await context.close();
      if (status > 0 && status < 500) return base;
    } catch (e) {
      await context.close().catch(() => {});
      console.warn(`  Base unreachable: ${base} (${e.message})`);
    }
  }
  return null;
}

async function runApp(browser, app, form) {
  const results = { ok: [], fail: [], dims: [], failUrls: [] };
  const bases = app.bases || [app.base];
  const base = await resolveBase(browser, bases);
  if (!base) {
    console.error(`  FAIL: no reachable base for ${app.id}`);
    for (const s of app.shots) {
      results.fail.push(s.name);
      results.failUrls.push((bases[0] || "") + s.path);
    }
    return results;
  }
  console.log(`  Using base: ${base}`);

  const isIos = form.name.startsWith("ios");
  const isTablet = Boolean(form.isTablet);
  const context = await browser.newContext({
    viewport: form.viewport,
    deviceScaleFactor: form.deviceScaleFactor,
    isMobile: !isTablet,
    hasTouch: true,
    userAgent: isTablet
      ? "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : isIos
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  const outDir = form.outDir(app.id);

  // Dismiss onboarding once at base for apps that gate all routes
  if (app.id === "curbcue" || app.id === "coachcore" || app.id === "motocrew") {
    try {
      await gotoSafe(page, base.replace(/\/$/, "") + "/");
      await dismissOverlays(page);
      // CurbCue: explicit demo gate (must clear before SPA routes work)
      if (app.id === "curbcue") {
        const demo = page.getByRole("button", { name: /I understand/i }).first();
        if (await demo.isVisible({ timeout: 2000 }).catch(() => false)) {
          await demo.click({ force: true });
          await page.waitForTimeout(SETTLE_MS);
        }
      }
    } catch {
      /* continue */
    }
  }

  for (const shot of app.shots) {
    const outPath = path.join(outDir, `${shot.name}.png`);
    const url = base.replace(/\/$/, "") + shot.path;
    try {
      let usedFallback = false;
      try {
        await gotoSafe(page, url);
      } catch (e) {
        if (shot.fallbackPath != null) {
          console.warn(`  ${shot.name}: primary failed, trying fallback`);
          await gotoSafe(page, base.replace(/\/$/, "") + shot.fallbackPath);
          usedFallback = true;
          if (shot.fallbackAfter) await shot.fallbackAfter(page);
        } else {
          throw e;
        }
      }

      if (shot.on404 === "home") {
        const bodyText = await page.locator("body").innerText().catch(() => "");
        const title = await page.title().catch(() => "");
        const is404 =
          page.url().includes("404") ||
          /not found|404/i.test(bodyText.slice(0, 500)) ||
          /not found|404/i.test(title);
        if (is404) {
          console.warn(`  ${shot.name}: 404, capturing home instead`);
          await gotoSafe(page, base.replace(/\/$/, "") + "/");
        }
      }

      if (shot.before) await shot.before(page);
      if (!usedFallback && shot.afterNav) await shot.afterNav(page);
      await dismissOverlays(page);
      await page.waitForTimeout(500);

      const meta = await captureShot(page, outPath, form);
      if (meta.bytes < 10000) console.warn(`  WARN ${shot.name}: small file ${meta.bytes} bytes`);
      console.log(
        `  OK ${form.name} ${shot.name} ${meta.width}×${meta.height} (${meta.bytes} bytes)`
      );
      results.ok.push(shot.name);
      results.dims.push(`${shot.name}:${meta.width}x${meta.height}`);

      if (shot.fallbackName && usedFallback) {
        const alt = path.join(outDir, `${shot.fallbackName}.png`);
        await captureShot(page, alt, form);
        console.log(`  Also saved ${shot.fallbackName}`);
      }
    } catch (e) {
      console.error(`  FAIL ${form.name} ${shot.name}: ${e.message}`);
      results.fail.push(shot.name);
      results.failUrls.push(url);
    }
  }

  await context.close();
  return results;
}

async function main() {
  const forms = parseFormsFromArgs(process.argv.slice(2));
  const appFilter = process.argv.find((a) => a.startsWith("--apps="));
  const appIds = appFilter
    ? appFilter
        .slice("--apps=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;
  const apps = appIds ? APPS.filter((a) => appIds.includes(a.id)) : APPS;
  if (appIds && apps.length === 0) {
    console.error(`No matching apps for --apps=${appIds.join(",")}`);
    process.exit(1);
  }

  console.log("Launching Chromium...");
  console.log(
    `Forms: ${forms.map((f) => `${f.name}=${f.targetW}×${f.targetH}`).join(", ")}`
  );
  const browser = await chromium.launch({ headless: true });
  const summary = {};

  for (const app of apps) {
    console.log(`\n=== ${app.id} ===`);
    summary[app.id] = {};
    try {
      for (const form of forms) {
        summary[app.id][form.name] = await runApp(browser, app, form);
      }
      updateManifest(app.id);
    } catch (e) {
      console.error(`App ${app.id} crashed: ${e.message}`);
      summary[app.id].error = e.message;
    }
  }

  await browser.close();

  console.log("\n\n======== SUMMARY ========");
  for (const [id, r] of Object.entries(summary)) {
    if (r.error) {
      console.log(`${id}: ERROR ${r.error}`);
      continue;
    }
    for (const form of forms) {
      const s = r[form.name] || { ok: [], fail: [], failUrls: [] };
      console.log(
        `${id} ${form.name}: ${s.ok.length} ok / ${s.fail.length} fail → ${form.outDir(id)}`
      );
      if (s.fail.length) {
        console.log(`  fails: ${s.fail.join(", ")}`);
        if (s.failUrls?.length) console.log(`  urls: ${s.failUrls.join(", ")}`);
      }
    }
  }

  const summaryName = forms.every((f) => f.name === "ios-ipad-12.9")
    ? "capture-summary-ipad.json"
    : "capture-summary.json";
  fs.writeFileSync(path.join(ROOT, "scripts", summaryName), JSON.stringify(summary, null, 2));
  console.log(`\nWrote scripts/${summaryName}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
