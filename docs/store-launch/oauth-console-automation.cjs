const { chromium } = require("playwright");
const path = require("path");
const os = require("os");

async function main() {
  const userDataDir = path.join(
    os.homedir(),
    "AppData",
    "Local",
    "MackSimsOAuthAutomation",
    "EdgeProfile",
  );

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "msedge",
    headless: false,
    viewport: null,
    args: [
      "--start-maximized",
      "--remote-debugging-address=127.0.0.1",
      "--remote-debugging-port=9223",
    ],
  });

  const pages = context.pages();
  const page = pages[0] || (await context.newPage());
  await page.goto("https://developers.facebook.com/apps/", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });

  console.log(`OAUTH_WINDOW_READY ${await page.title()}`);
  console.log("OAUTH_CONSOLE Meta for Developers");
  console.log("OAUTH_WAITING_FOR_USER_LOGIN");

  await new Promise((resolve) => context.once("close", resolve));
}

main().catch((error) => {
  console.error(`OAUTH_AUTOMATION_FAILED ${error.message}`);
  process.exitCode = 1;
});
