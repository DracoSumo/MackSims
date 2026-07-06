export type BetaIntakePayload = {
  name: string;
  email: string;
  organization: string;
  lane: string;
  message: string;
};

export type BetaIntakeChannel = "formspree" | "netlify" | "local" | "mailto";

export type BetaIntakeResult =
  | { ok: true; channel: BetaIntakeChannel; cloudSync?: "ok" | "skipped" | "error" }
  | { ok: false; channel: "none"; error: string; mailtoUrl?: string };

const STORAGE_KEY = "coachcore.betaRequests";
const NETLIFY_FORM_NAME = "coachcore-beta";
const BETA_EMAIL = "feedback@macksims.com";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_COACHCORE_BETA_ENDPOINT?.trim() || "";

function readLocalRecords(): Array<BetaIntakePayload & { id: string; savedAt: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

async function saveLocal(payload: BetaIntakePayload): Promise<"local" | "cloud" | "cloud-error"> {
  const record = {
    id: crypto.randomUUID(),
    ...payload,
    savedAt: new Date().toISOString(),
  };
  const existing = readLocalRecords();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 20)));
  } catch {
    // private mode / quota — Supabase push may still succeed
  }
  const { pushBetaRequest } = await import("./supabaseSync");
  const sync = await pushBetaRequest(payload);
  if (sync === "ok") return "cloud";
  if (sync === "error") return "cloud-error";
  return "local";
}

function canUseNetlifyForms(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

export function buildBetaMailtoUrl(payload: BetaIntakePayload): string {
  const body = [
    "CoachCore beta request",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Organization: ${payload.organization || "(not provided)"}`,
    `Lane: ${payload.lane}`,
    "",
    payload.message || "(no message)",
  ].join("\n");

  const params = new URLSearchParams({
    subject: "CoachCore Beta Request",
    body,
  });
  return `mailto:${BETA_EMAIL}?${params.toString()}`;
}

async function submitFormspree(payload: BetaIntakePayload): Promise<boolean> {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      _subject: "CoachCore beta request",
      app: "CoachCore",
      source: "coachcore-beta-form",
    }),
  });
  return response.ok;
}

async function postNetlifyForm(path: string, payload: BetaIntakePayload): Promise<boolean> {
  const body = new URLSearchParams({
    "form-name": NETLIFY_FORM_NAME,
    name: payload.name,
    email: payload.email,
    organization: payload.organization,
    lane: payload.lane,
    message: payload.message,
    app: "CoachCore",
    source: "coachcore-beta-form",
  });

  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  return response.ok || response.status === 302;
}

async function submitNetlifyForm(payload: BetaIntakePayload): Promise<boolean> {
  const paths = ["/", "/beta/", "/netlify-forms.html"];
  for (const path of paths) {
    try {
      if (await postNetlifyForm(path, payload)) return true;
    } catch {
      // try next path
    }
  }
  return false;
}

export async function submitBetaRequest(payload: BetaIntakePayload): Promise<BetaIntakeResult> {
  if (!payload.name.trim() || !payload.email.trim()) {
    return { ok: false, channel: "none", error: "Name and email are required." };
  }

  if (FORMSPREE_ENDPOINT) {
    try {
      if (await submitFormspree(payload)) {
        const cloud = await saveLocal(payload);
        return {
          ok: true,
          channel: "formspree",
          cloudSync: cloud === "cloud" ? "ok" : cloud === "cloud-error" ? "error" : "skipped",
        };
      }
      return {
        ok: false,
        channel: "none",
        error: "Formspree returned an error. Use the email fallback below.",
        mailtoUrl: buildBetaMailtoUrl(payload),
      };
    } catch {
      const cloud = await saveLocal(payload);
      return {
        ok: true,
        channel: "local",
        cloudSync: cloud === "cloud" ? "ok" : cloud === "cloud-error" ? "error" : "skipped",
      };
    }
  }

  if (canUseNetlifyForms()) {
    try {
      if (await submitNetlifyForm(payload)) {
        const cloud = await saveLocal(payload);
        return {
          ok: true,
          channel: "netlify",
          cloudSync: cloud === "cloud" ? "ok" : cloud === "cloud-error" ? "error" : "skipped",
        };
      }
    } catch {
      // fall through
    }
  }

  const cloud = await saveLocal(payload);
  return {
    ok: true,
    channel: "local",
    cloudSync: cloud === "cloud" ? "ok" : cloud === "cloud-error" ? "error" : "skipped",
  };
}

export function intakeModeLabel(): string {
  if (FORMSPREE_ENDPOINT) return "Formspree endpoint configured";
  if (typeof window !== "undefined" && canUseNetlifyForms()) {
    return "Tries Netlify Forms first, then saves locally. Email fallback always available.";
  }
  return "Local browser save + email fallback";
}

export function hasRemoteBetaIntake(): boolean {
  return Boolean(FORMSPREE_ENDPOINT) || canUseNetlifyForms();
}
