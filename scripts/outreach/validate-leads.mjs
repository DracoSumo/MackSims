#!/usr/bin/env node
/**
 * Validate MackSims outreach lead CSVs.
 * Usage: node scripts/outreach/validate-leads.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const leadsDir = path.resolve(__dirname, "../../docs/outreach/leads");

const REQUIRED = [
  "business_name",
  "vertical",
  "product",
  "contact_name",
  "email",
  "phone",
  "city",
  "region",
  "website",
  "source_url",
  "verification",
  "status",
  "last_contacted",
  "notes"
];

const VERTICALS = new Set(["venue", "photographer", "charter"]);
const PRODUCTS = new Set(["CurbCue", "ShutterBid", "FishCrew"]);
const VERIFICATIONS = new Set([
  "page_verified",
  "directory_listed",
  "published_possible_typo",
  "unverified"
]);
const STATUSES = new Set([
  "researched",
  "queued",
  "touched1",
  "touched2",
  "touched3",
  "replied",
  "meeting",
  "do_not_contact"
]);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

function validateFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const rows = parseCsv(raw);
  if (!rows.length) return [`${filePath}: empty`];
  const headers = rows[0];
  const errors = [];
  for (const h of REQUIRED) {
    if (!headers.includes(h)) errors.push(`${filePath}: missing column ${h}`);
  }
  if (errors.length) return errors;

  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const emails = new Map();
  for (let r = 1; r < rows.length; r++) {
    const line = rows[r];
    const label = `${path.basename(filePath)}:${r + 1}`;
    const email = (line[idx.email] || "").trim();
    const vertical = (line[idx.vertical] || "").trim();
    const product = (line[idx.product] || "").trim();
    const verification = (line[idx.verification] || "").trim();
    const status = (line[idx.status] || "").trim();
    const business = (line[idx.business_name] || "").trim();

    if (!business) errors.push(`${label}: business_name required`);
    if (!emailRe.test(email)) errors.push(`${label}: invalid email "${email}"`);
    if (!VERTICALS.has(vertical)) errors.push(`${label}: bad vertical "${vertical}"`);
    if (!PRODUCTS.has(product)) errors.push(`${label}: bad product "${product}"`);
    if (!VERIFICATIONS.has(verification)) errors.push(`${label}: bad verification "${verification}"`);
    if (!STATUSES.has(status)) errors.push(`${label}: bad status "${status}"`);

    const key = email.toLowerCase();
    if (emails.has(key)) {
      errors.push(`${label}: duplicate email also on ${emails.get(key)}`);
    } else {
      emails.set(key, label);
    }
  }
  return errors;
}

const files = fs
  .readdirSync(leadsDir)
  .filter((f) => f.endsWith(".csv"))
  .map((f) => path.join(leadsDir, f));

if (!files.length) {
  console.error("No CSV files in", leadsDir);
  process.exit(1);
}

const allErrors = files.flatMap(validateFile);
if (allErrors.length) {
  console.error("Lead validation failed:\n" + allErrors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}

let total = 0;
for (const file of files) {
  const rows = parseCsv(fs.readFileSync(file, "utf8"));
  const count = rows.length - 1;
  total += count;
  console.log(`${path.basename(file)}: ${count} leads`);
}
console.log(`OK — ${total} leads across ${files.length} files`);
