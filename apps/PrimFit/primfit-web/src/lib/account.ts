import { loadJson, saveJson } from "@/lib/storage";

export const ACCOUNT_HINT_KEY = "primfit.accountHint";

export type AccountHint = {
  skipped?: boolean;
  email?: string;
  savedAt?: string;
};

export function getAccountHint(): AccountHint {
  return loadJson<AccountHint>(ACCOUNT_HINT_KEY, {});
}

export function saveAccountHint(hint: AccountHint) {
  saveJson(ACCOUNT_HINT_KEY, hint);
}

export function memberEmail(hint = getAccountHint()): string | null {
  const email = hint.email?.trim();
  return email || null;
}

export function rememberEmail(email: string): AccountHint {
  const next: AccountHint = {
    email: email.trim(),
    skipped: false,
    savedAt: new Date().toISOString(),
  };
  saveAccountHint(next);
  return next;
}

export function skipAccountHint(): AccountHint {
  const next: AccountHint = { skipped: true, savedAt: new Date().toISOString() };
  saveAccountHint(next);
  return next;
}
