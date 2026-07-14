#!/usr/bin/env node
/**
 * Capture CoachCore store screenshots from production.
 * Requires: npx playwright install chromium (one-time)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.COACHCORE_SCREEN_BASE || "https://coachcore7.netlify.app";
const OUT = path.join(process.cwd(), "store-assets", "v071");

const shots = [
  { name: "01-landing", path: "/", width: 1290, height: 2796 },
  { name: "02-dashboard", path: "/app", width: 1290, height: 2796 },
  { name: "03-accountability", path: "/app/accountability", width: 1290, height: 2796 },
  { name: "04-training", path: "/app/training", width: 1290, height: 2796 },
  { name: "05-chat", path: "/app/chat", width: 1290, height: 2796 },
  { name: "06-dashboard-tablet", path: "/app", width: 1200, height: 1920 },
];

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: "en-US" });

  for (const shot of shots) {
    const page = await context.newPage();
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      sessionStorage.setItem("coachcore.demoWalkthroughDismissed", "1");
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const file = path.join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log("Saved", file);
    await page.close();
  }

  await browser.close();
  await writeFile(
    path.join(OUT, "manifest.json"),
    JSON.stringify({ base: BASE, shots, capturedAt: new Date().toISOString() }, null, 2),
  );
  console.log("Done →", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
