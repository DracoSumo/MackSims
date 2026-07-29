const { chromium } = require("playwright");

const endpoint = "http://127.0.0.1:9223";

const APPS = [
  {
    name: "CoachCore",
    metaAppId: "1732171628101176",
    supabaseProject: "bfqfbkldxbojrrxeidcc",
    callback: "https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback",
  },
  {
    name: "CurbCue",
    metaAppId: "2243402953092342",
    supabaseProject: "dsbwqxhqktzsdleeobbi",
    callback: "https://dsbwqxhqktzsdleeobbi.supabase.co/auth/v1/callback",
  },
  {
    name: "MotoCrew",
    metaAppId: "1040026771740958",
    supabaseProject: "npmiwnxnqgonnmwvblyi",
    callback: "https://npmiwnxnqgonnmwvblyi.supabase.co/auth/v1/callback",
  },
  {
    name: "SermonStudio",
    metaAppId: "1616615176822509",
    supabaseProject: "zipxwqkmenapnckwyzrh",
    callback: "https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback",
  },
];

function safeLog(message) {
  if (
    /secret|password|token|cookie|authorization|apikey|service_role/i.test(
      message,
    )
  ) {
    console.log("SAFE_LOG_BLOCKED");
    return;
  }
  console.log(message);
}

async function connect() {
  return chromium.connectOverCDP(endpoint);
}

async function pages(browser) {
  return browser.contexts().flatMap((context) => context.pages());
}

async function pageByHost(browser, host) {
  const all = await pages(browser);
  return all.find((page) => {
    try {
      return new URL(page.url()).host === host;
    } catch {
      return false;
    }
  });
}

async function ensurePage(browser, host) {
  let page = await pageByHost(browser, host);
  if (!page) {
    page = await browser.contexts()[0].newPage();
  }
  return page;
}

async function readMetaSecret(metaPage, appId) {
  const targetPath = `/apps/${appId}/settings/basic/`;
  if (new URL(metaPage.url()).pathname !== targetPath) {
    await metaPage.goto(
      `https://developers.facebook.com${targetPath}`,
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
  }
  await metaPage
    .locator('input[name="app_details_privacy_policy_url"]')
    .waitFor({ timeout: 30000 });

  let secret = "";
  async function readRevealedValue() {
    const textInputs = metaPage.locator("input[type=text]");
    for (let index = 0; index < (await textInputs.count()); index += 1) {
      const input = textInputs.nth(index);
      const label = await input.evaluate((element) => {
        const ids = (element.getAttribute("aria-labelledby") || "")
          .split(/\s+/)
          .filter(Boolean);
        return ids
          .map((id) => document.getElementById(id)?.textContent || "")
          .join(" ")
          .toLowerCase();
      });
      const value = await input.inputValue();
      if (/app secret/.test(label) && value && value.length > 8) {
        return value;
      }
    }
    return "";
  }

  secret = await readRevealedValue();
  if (!secret) {
    const showButtons = metaPage.getByRole("button", { name: /^Show$/i });
    if ((await showButtons.count()) < 1) {
      throw new Error("Meta credential reveal control was not found");
    }
    await showButtons.first().click();
    await metaPage.waitForTimeout(800);
    if (
      (await metaPage
        .getByRole("dialog")
        .filter({ hasText: /re-enter your password/i })
        .count()) > 0
    ) {
      throw new Error("Meta password re-entry is required");
    }
    secret = await readRevealedValue();
  }

  if (!secret) {
    throw new Error("Meta credential could not be read after reveal");
  }
  return secret;
}

async function configureSupabaseFacebook(supabasePage, app) {
  const { supabaseProject, metaAppId, secret } = app;
  await supabasePage.goto(
    `https://supabase.com/dashboard/project/${supabaseProject}/auth/providers`,
    { waitUntil: "domcontentloaded", timeout: 120000 },
  );
  await supabasePage.waitForTimeout(2000);

  if (new URL(supabasePage.url()).pathname.includes("/sign-in")) {
    throw new Error("Supabase session expired; sign-in required");
  }

  const facebookRow = supabasePage
    .getByRole("button")
    .filter({ hasText: /Facebook/i })
    .first();
  await facebookRow.waitFor({ timeout: 30000 });
  if (!(await supabasePage.locator("#EXTERNAL_FACEBOOK_CLIENT_ID").isVisible())) {
    await facebookRow.click();
    await supabasePage.waitForTimeout(1000);
  }

  const clientId = supabasePage.locator("#EXTERNAL_FACEBOOK_CLIENT_ID");
  const clientSecret = supabasePage.locator("#EXTERNAL_FACEBOOK_SECRET");

  await clientId.waitFor({ timeout: 20000 });
  await clientId.fill(metaAppId);
  await clientSecret.fill(secret);

  const enable = supabasePage.locator("#EXTERNAL_FACEBOOK_ENABLED");
  if ((await enable.getAttribute("aria-checked")) !== "true") {
    await enable.click();
  }

  await supabasePage.getByRole("button", { name: /^Save$/i }).click();
  await supabasePage.waitForTimeout(2500);

  const savedRow = supabasePage
    .getByRole("button")
    .filter({ hasText: /Facebook/i })
    .filter({ hasText: /Enabled/i })
    .first();
  await savedRow.waitFor({ timeout: 30000 });
  await savedRow.click();
  await supabasePage.waitForTimeout(800);

  const enabled =
    (await supabasePage
      .locator("#EXTERNAL_FACEBOOK_ENABLED")
      .getAttribute("aria-checked")) === "true";
  const savedClientId = await supabasePage
    .locator("#EXTERNAL_FACEBOOK_CLIENT_ID")
    .inputValue();
  const callbackValue = await supabasePage.locator("input").evaluateAll(
    (elements, expected) => elements.some((element) => element.value === expected),
    app.callback,
  );

  return {
    enabled,
    clientIdMatches: savedClientId === metaAppId,
    callbackMatches: callbackValue,
  };
}

async function inspectProviders() {
  const browser = await connect();
  try {
    const page = await ensurePage(browser, "supabase.com");
    await page.goto(
      "https://supabase.com/dashboard/project/bfqfbkldxbojrrxeidcc/auth/providers",
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
    await page.waitForTimeout(2000);
    safeLog(`PATH=${new URL(page.url()).pathname}`);
    safeLog(`TITLE=${await page.title()}`);
    const buttons = (await page.getByRole("button").allTextContents())
      .filter(Boolean)
      .filter((text) => /facebook|google|github|save|enable/i.test(text))
      .slice(0, 30);
    safeLog(`BUTTONS=${JSON.stringify(buttons)}`);
    const headings = (await page.getByRole("heading").allTextContents()).slice(
      0,
      20,
    );
    safeLog(`HEADINGS=${JSON.stringify(headings)}`);
    const switches = await page.locator('[role="switch"]').count();
    safeLog(`SWITCHES=${switches}`);
    const labels = (await page.locator("label").allTextContents())
      .filter((text) => /facebook|client|secret|enable/i.test(text))
      .slice(0, 20);
    safeLog(`LABELS=${JSON.stringify(labels)}`);
  } finally {
    await browser.close();
  }
}

async function inspectMetaSecretUi() {
  const browser = await connect();
  try {
    const page = await ensurePage(browser, "developers.facebook.com");
    await page.goto(
      "https://developers.facebook.com/apps/1732171628101176/settings/basic/",
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
    await page
      .locator('input[name="app_details_privacy_policy_url"]')
      .waitFor({ timeout: 30000 });
    const showCount = await page.getByRole("button", { name: /^Show$/i }).count();
    safeLog(`SHOW_BUTTONS=${showCount}`);
    const passwordCount = await page.locator('input[type="password"]').count();
    safeLog(`PASSWORD_INPUTS=${passwordCount}`);
    const secretLabels = await page.locator("input").evaluateAll((elements) =>
      elements
        .map((element) => {
          const ids = (element.getAttribute("aria-labelledby") || "")
            .split(/\s+/)
            .filter(Boolean);
          const label = ids
            .map((id) => document.getElementById(id)?.textContent || "")
            .join(" ")
            .trim();
          return {
            type: element.type,
            label,
            hasValue: Boolean(element.value),
            valueLength: element.value ? element.value.length : 0,
          };
        })
        .filter((item) => /secret|app id/i.test(item.label)),
    );
    safeLog(`SECRET_FIELDS=${JSON.stringify(secretLabels)}`);
  } finally {
    await browser.close();
  }
}

async function wireOne(name) {
  const app = APPS.find((entry) => entry.name === name);
  if (!app) throw new Error(`Unknown app ${name}`);

  const browser = await connect();
  try {
    const metaPage = await ensurePage(browser, "developers.facebook.com");
    const secret = await readMetaSecret(metaPage, app.metaAppId);
    const supabasePage = await ensurePage(browser, "supabase.com");
    const result = await configureSupabaseFacebook(supabasePage, {
      ...app,
      secret,
    });
    safeLog(`WIRED=${app.name}`);
    safeLog(`ENABLED=${result.enabled}`);
    safeLog(`CLIENT_ID_MATCHES=${result.clientIdMatches}`);
    safeLog(`CALLBACK_MATCHES=${result.callbackMatches}`);
  } finally {
    await browser.close();
  }
}

async function verifyOne(name) {
  const app = APPS.find((entry) => entry.name === name);
  if (!app) throw new Error(`Unknown app ${name}`);
  const browser = await connect();
  try {
    const page = await ensurePage(browser, "supabase.com");
    await page.goto(
      `https://supabase.com/dashboard/project/${app.supabaseProject}/auth/providers`,
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
    await page.waitForTimeout(1800);
    if (new URL(page.url()).pathname.includes("/sign-in")) {
      throw new Error("Supabase session expired");
    }
    const facebook = page
      .getByRole("button")
      .filter({ hasText: /Facebook/i })
      .filter({ hasText: /Enabled/i })
      .first();
    await facebook.click();
    await page.waitForTimeout(800);
    const clientId = page.locator("#EXTERNAL_FACEBOOK_CLIENT_ID");
    const enable = page.locator("#EXTERNAL_FACEBOOK_ENABLED");
    const savedClientId = await clientId.inputValue().catch(() => "");
    const enabled = (await enable.getAttribute("aria-checked")) === "true";
    const callbackMatches = await page.locator("input").evaluateAll(
      (elements, expected) => elements.some((element) => element.value === expected),
      app.callback,
    );
    safeLog(`VERIFY_APP=${app.name}`);
    safeLog(`VERIFY_CLIENT_ID_MATCHES=${savedClientId === app.metaAppId}`);
    safeLog(`VERIFY_ENABLED=${enabled}`);
    safeLog(`VERIFY_CALLBACK_MATCHES=${callbackMatches}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const command = process.argv[2];
  if (command === "inspect-providers") return inspectProviders();
  if (command === "inspect-meta-secret") return inspectMetaSecretUi();
  if (command === "wire") return wireOne(process.argv[3]);
  if (command === "verify") return verifyOne(process.argv[3]);
  throw new Error(`Unknown command ${command}`);
}

main().catch((error) => {
  console.error(`SUPABASE_FACEBOOK_WIRE_FAILED ${error.message}`);
  process.exitCode = 1;
});
