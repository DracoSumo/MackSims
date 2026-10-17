const { chromium } = require("playwright");

const endpoint = "http://127.0.0.1:9223";

async function withPage(run) {
  const browser = await chromium.connectOverCDP(endpoint);
  try {
    const pages = browser.contexts().flatMap((context) => context.pages());
    if (pages.length === 0) {
      throw new Error("Expected an automation page, found 0");
    }
    const preferred =
      pages.find((page) => /developers\.facebook\.com/i.test(page.url())) ||
      pages.find((page) => /facebook\.com|meta\.com/i.test(page.url())) ||
      pages[0];
    await run(preferred);
  } finally {
    await browser.close();
  }
}

async function radioDescription(radio) {
  return radio.evaluate((element) => {
    let current = element;
    for (let depth = 0; current && depth < 5; depth += 1) {
      const text = (current.innerText || "").trim();
      if (text.length > 2) return text;
      current = current.parentElement;
    }
    return element.getAttribute("aria-label") || "";
  });
}

async function inputByLabelText(page, labelText) {
  const inputs = page.locator("input[type=text]");
  for (let index = 0; index < (await inputs.count()); index += 1) {
    const input = inputs.nth(index);
    const label = await input.evaluate((element) => {
      const ids = (element.getAttribute("aria-labelledby") || "")
        .split(/\s+/)
        .filter(Boolean);
      return ids
        .map((id) => document.getElementById(id)?.textContent || "")
        .join(" ");
    });
    if ((label || "").trim().toLowerCase() === labelText.toLowerCase()) {
      return input;
    }
  }
  throw new Error(`Could not find field labelled ${labelText}`);
}

async function main() {
  const command = process.argv[2];

  await withPage(async (page) => {
    if (command === "ensure-app") {
      const appName = process.argv[3];
      if (!["CoachCore", "CurbCue", "MotoCrew", "Sermon Studio"].includes(appName)) {
        throw new Error("App name is not on the approved product list");
      }
      await page.goto("https://developers.facebook.com/apps/", {
        waitUntil: "domcontentloaded",
        timeout: 120000,
      });
      await page.waitForTimeout(1500);
      const existing = page.getByText(appName, { exact: true });
      const existingCount = await existing.count();
      if (existingCount > 0) {
        const ids = await existing.evaluateAll((elements) => {
          const found = new Set();
          for (const element of elements) {
            let current = element;
            while (current) {
              const href = current.href || current.getAttribute?.("href") || "";
              const match = href.match(/\/apps\/(\d+)\//);
              if (match) found.add(match[1]);
              current = current.parentElement;
            }
          }
          return [...found];
        });
        if (ids.length !== 1) {
          throw new Error(
            `Existing ${appName} mapping is ambiguous (${ids.length} app IDs)`,
          );
        }
        console.log(`APP_REUSED=${appName}`);
        console.log(`APP_ID=${ids[0]}`);
        return;
      }

      await page
        .getByRole("button", { name: /create app/i })
        .or(page.getByRole("link", { name: /create app/i }))
        .first()
        .click();
      await page.waitForURL(/\/apps\/creation\//, { timeout: 30000 });
      await page.waitForTimeout(800);
      const detailInputs = page.locator("input");
      if ((await detailInputs.count()) < 3) {
        throw new Error("Expected Meta app detail inputs");
      }
      await detailInputs.nth(1).fill(appName);
      if (!(await detailInputs.nth(2).inputValue())) {
        throw new Error("Meta app contact email is empty");
      }
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page
        .getByRole("button", {
          name: /Authenticate and request data from users with Facebook Login/i,
        })
        .click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      const radios = page.getByRole("radio");
      await radios.last().waitFor({ timeout: 30000 });
      let noPortfolio = null;
      for (let index = 0; index < (await radios.count()); index += 1) {
        const radio = radios.nth(index);
        const snapshot = await radio.ariaSnapshot();
        if (/don.?t want|portfolio yet|no business|not connect/i.test(snapshot)) {
          noPortfolio = radio;
          break;
        }
      }
      if (!noPortfolio) {
        throw new Error("No unambiguous no-portfolio option found");
      }
      await noPortfolio.check();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.getByRole("button", { name: /create app/i }).click();
      await page.waitForURL(/\/apps\/\d+\/dashboard\//, { timeout: 60000 });
      const id = new URL(page.url()).pathname.match(/\/apps\/(\d+)\//)?.[1];
      if (!id) throw new Error("Created app ID could not be confirmed");
      console.log(`APP_CREATED=${appName}`);
      console.log(`APP_ID=${id}`);
      return;
    }

    if (command === "business-inspect") {
      const radios = page.getByRole("radio");
      const classifications = [];
      for (let index = 0; index < (await radios.count()); index += 1) {
        const text = await radioDescription(radios.nth(index));
        classifications.push(
          /don.?t want|portfolio yet|without.*portfolio|no business|not connect/i.test(text)
            ? "NO_PORTFOLIO_OPTION"
            : "PORTFOLIO_OPTION",
        );
      }
      console.log(`BUSINESS_OPTIONS=${JSON.stringify(classifications)}`);
      return;
    }

    if (command === "business-names") {
      const radios = page.getByRole("radio");
      const names = [];
      for (let index = 0; index < (await radios.count()); index += 1) {
        const radio = radios.nth(index);
        const snapshot = await radio.ariaSnapshot();
        names.push(snapshot.replace(/\s+/g, " ").slice(0, 120));
      }
      console.log(`BUSINESS_NAMES=${JSON.stringify(names)}`);
      return;
    }

    if (command === "business-none-next") {
      const radios = page.getByRole("radio");
      let noPortfolio = null;
      for (let index = 0; index < (await radios.count()); index += 1) {
        const radio = radios.nth(index);
        const text = await radioDescription(radio);
        const snapshot = await radio.ariaSnapshot();
        if (
          /don.?t want|portfolio yet|without.*portfolio|no business|not connect/i.test(
            `${text} ${snapshot}`,
          )
        ) {
          noPortfolio = radio;
          break;
        }
      }
      if (!noPortfolio) {
        throw new Error("No unambiguous no-portfolio option found");
      }
      await noPortfolio.check();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForTimeout(1200);
      const buttons = (await page.getByRole("button").allTextContents()).filter(
        (text) => /next|back|cancel|create|requirements|overview/i.test(text),
      );
      console.log(`NEXT_STEP_BUTTONS=${JSON.stringify(buttons.slice(-12))}`);
      return;
    }

    if (command === "next") {
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForTimeout(1200);
      const buttons = (await page.getByRole("button").allTextContents()).filter(
        (text) => /next|back|cancel|create|overview/i.test(text),
      );
      console.log(`NEXT_STEP_BUTTONS=${JSON.stringify(buttons.slice(-12))}`);
      return;
    }

    if (command === "create") {
      const create = page.getByRole("button", {
        name: /create app/i,
      });
      if ((await create.count()) !== 1) {
        throw new Error(`Expected one Create app button, found ${await create.count()}`);
      }
      await create.click();
      await page.waitForTimeout(2000);
      console.log(`TITLE=${await page.title()}`);
      console.log(`PATH=${new URL(page.url()).pathname}`);
      console.log(
        `PASSWORD_PROMPT=${(await page.locator('input[type="password"]').count()) > 0}`,
      );
      return;
    }

    if (command === "basic") {
      const appId = process.argv[3];
      const domain = process.argv[4];
      if (!/^\d+$/.test(appId) || !/^[a-z0-9.-]+$/.test(domain)) {
        throw new Error("Invalid basic-settings arguments");
      }
      const privacyUrl = "https://macksims-public-site.netlify.app/privacy/";
      const deletionUrl =
        "https://macksims-public-site.netlify.app/account-deletion/";

      await page.goto(
        `https://developers.facebook.com/apps/${appId}/settings/basic/`,
        { waitUntil: "domcontentloaded", timeout: 120000 },
      );
      await page
        .locator('input[name="app_details_privacy_policy_url"]')
        .waitFor({ timeout: 30000 });

      const domainInput = await inputByLabelText(page, "App domains");
      await domainInput.fill(domain);
      await domainInput.press("Enter");
      await page
        .locator('input[name="app_details_privacy_policy_url"]')
        .fill(privacyUrl);
      await page
        .locator('input[name="app_details_user_data_deletion"]')
        .fill(deletionUrl);
      await page.getByRole("button", { name: "Save Changes", exact: true }).click();
      await page.waitForTimeout(1800);

      const privacySaved =
        (await page
          .locator('input[name="app_details_privacy_policy_url"]')
          .inputValue()) === privacyUrl;
      const deletionSaved =
        (await page
          .locator('input[name="app_details_user_data_deletion"]')
          .inputValue()) === deletionUrl;
      const domainSaved = (await page.getByText(domain, { exact: true }).count()) > 0;
      const alerts = (await page.getByRole("alert").allTextContents()).filter(Boolean);
      console.log(`BASIC_DOMAIN_SAVED=${domainSaved}`);
      console.log(`BASIC_PRIVACY_SAVED=${privacySaved}`);
      console.log(`BASIC_DELETION_SAVED=${deletionSaved}`);
      console.log(
        `BASIC_ALERT=${alerts
          .map((text) => text.replace(/\s+/g, " ").slice(0, 140))
          .join(" | ")}`,
      );
      return;
    }

    if (command === "login") {
      const appId = process.argv[3];
      const callback = process.argv[4];
      if (
        !/^\d+$/.test(appId) ||
        !/^https:\/\/[a-z0-9]+\.supabase\.co\/auth\/v1\/callback$/.test(callback)
      ) {
        throw new Error("Invalid Facebook Login settings arguments");
      }
      await page.goto(
        `https://developers.facebook.com/apps/${appId}/fb-login/settings/`,
        { waitUntil: "domcontentloaded", timeout: 120000 },
      );
      const redirectInput = page.getByRole("combobox", {
        name: "Valid OAuth redirect URIs.",
        exact: true,
      });
      await redirectInput.waitFor({ timeout: 30000 });
      await redirectInput.fill(callback);
      await redirectInput.press("Enter");

      for (const name of ["client_oauth", "web_oauth", "web_oauth_https_only", "strict_matching"]) {
        const checkbox = page.locator(`input[type="checkbox"][name="${name}"]`);
        if (!(await checkbox.isChecked())) await checkbox.check();
      }

      await page.getByRole("button", { name: "Save Changes", exact: true }).click();
      await page.waitForTimeout(1800);

      const callbackSaved = (await page.locator("body").innerText()).includes(callback);
      const settingsEnabled = {};
      for (const name of ["client_oauth", "web_oauth", "web_oauth_https_only", "strict_matching"]) {
        settingsEnabled[name] = await page
          .locator(`input[type="checkbox"][name="${name}"]`)
          .isChecked();
      }
      console.log(`LOGIN_CALLBACK_SAVED=${callbackSaved}`);
      console.log(`LOGIN_SETTINGS=${JSON.stringify(settingsEnabled)}`);
      return;
    }

    if (command === "verify") {
      const appId = process.argv[3];
      const domain = process.argv[4];
      const callback = process.argv[5];
      if (
        !/^\d+$/.test(appId) ||
        !/^[a-z0-9.-]+$/.test(domain) ||
        !/^https:\/\/[a-z0-9]+\.supabase\.co\/auth\/v1\/callback$/.test(callback)
      ) {
        throw new Error("Invalid verification arguments");
      }
      const privacyUrl = "https://macksims-public-site.netlify.app/privacy/";
      const deletionUrl =
        "https://macksims-public-site.netlify.app/account-deletion/";

      await page.goto(
        `https://developers.facebook.com/apps/${appId}/settings/basic/`,
        { waitUntil: "domcontentloaded", timeout: 120000 },
      );
      await page
        .locator('input[name="app_details_privacy_policy_url"]')
        .waitFor({ timeout: 30000 });
      const basicBody = await page.locator("body").innerText();
      const basicVerified =
        basicBody.includes(domain) &&
        (await page
          .locator('input[name="app_details_privacy_policy_url"]')
          .inputValue()) === privacyUrl &&
        (await page
          .locator('input[name="app_details_user_data_deletion"]')
          .inputValue()) === deletionUrl;
      const unpublished =
        (await page.getByRole("button", { name: /Unpublished/i }).count()) > 0;

      await page.goto(
        `https://developers.facebook.com/apps/${appId}/fb-login/settings/`,
        { waitUntil: "domcontentloaded", timeout: 120000 },
      );
      await page
        .getByRole("combobox", {
          name: "Valid OAuth redirect URIs.",
          exact: true,
        })
        .waitFor({ timeout: 30000 });
      const loginBody = await page.locator("body").innerText();
      const inputHasCallback = await page.locator("input").evaluateAll(
        (elements, expected) => elements.some((element) => element.value === expected),
        callback,
      );
      const callbackVerified = loginBody.includes(callback) || inputHasCallback;
      const togglesVerified = await Promise.all(
        ["client_oauth", "web_oauth", "web_oauth_https_only", "strict_matching"].map(
          (name) =>
            page
              .locator(`input[type="checkbox"][name="${name}"]`)
              .isChecked(),
        ),
      );
      console.log(`VERIFY_BASIC=${basicVerified}`);
      console.log(`VERIFY_CALLBACK=${callbackVerified}`);
      console.log(`VERIFY_LOGIN_TOGGLES=${togglesVerified.every(Boolean)}`);
      console.log(`VERIFY_UNPUBLISHED=${unpublished}`);
      return;
    }

    throw new Error(`Unknown command: ${command}`);
  });
}

main().catch((error) => {
  console.error(`META_AUTOMATION_FAILED ${error.message}`);
  process.exitCode = 1;
});
