#!/usr/bin/env node
/**
 * Export mailto-ready draft lines for a vertical.
 * Usage:
 *   node scripts/outreach/export-mail-merge.mjs --vertical=charters
 *   node scripts/outreach/export-mail-merge.mjs --vertical=venues --touch=1
 *   node scripts/outreach/export-mail-merge.mjs --vertical=photographers --status=researched
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const leadsDir = path.resolve(__dirname, "../../docs/outreach/leads");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  })
);

const verticalFile = {
  venues: "venues-bermuda.csv",
  photographers: "photographers-bermuda.csv",
  charters: "charters-bermuda.csv",
  venue: "venues-bermuda.csv",
  photographer: "photographers-bermuda.csv",
  charter: "charters-bermuda.csv"
};

const vertical = args.vertical;
if (!vertical || !verticalFile[vertical]) {
  console.error("Pass --vertical=venues|photographers|charters");
  process.exit(1);
}

const touch = Number(args.touch || "1");
const statusFilter = args.status || "researched";

const subjects = {
  venue: {
    1: (b) => `Guest exits at ${b} — quick Bermuda pilot note`,
    2: (b) => `Re: Guest exits at ${b}`,
    3: (b) => `Closing the loop — ${b}`
  },
  photographer: {
    1: () => `Photographer beta seats — ShutterBid`,
    2: () => `Re: ShutterBid beta`,
    3: () => `Last note on ShutterBid`
  },
  charter: {
    1: (b) => `Charter crew app beta — FishCrew (${b})`,
    2: (b) => `Re: FishCrew for ${b}`,
    3: (b) => `Closing FishCrew invite — ${b}`
  }
};

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
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

const filePath = path.join(leadsDir, verticalFile[vertical]);
const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
const headers = rows[0];
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

const out = [];
for (let r = 1; r < rows.length; r++) {
  const line = rows[r];
  const status = line[idx.status];
  const verification = line[idx.verification];
  if (statusFilter !== "all" && status !== statusFilter) continue;
  if (verification === "published_possible_typo") continue;

  const business = line[idx.business_name];
  const email = line[idx.email];
  const product = line[idx.product];
  const vert = line[idx.vertical];
  const subjectFn = subjects[vert]?.[touch];
  if (!subjectFn) continue;
  const subject = subjectFn(business);
  const bodyHint = `See docs/outreach/EMAIL_SEQUENCES.md — ${product} touch ${touch}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Hi,\n\n[Paste ${product} touch ${touch} from EMAIL_SEQUENCES.md and personalize]\n\n— Chris Sims · MackSims · csims@macksims.com\n`
  )}`;
  out.push({ business, email, product, verification, status, subject, bodyHint, mailto });
}

if (args.json) {
  console.log(JSON.stringify(out, null, 2));
} else {
  console.log(`# Mail merge — ${vertical} touch ${touch} (status=${statusFilter})\n`);
  for (const row of out) {
    console.log(`## ${row.business}`);
    console.log(`To: ${row.email}`);
    console.log(`Subject: ${row.subject}`);
    console.log(`Verification: ${row.verification}`);
    console.log(`Draft: ${row.bodyHint}`);
    console.log(`Open: ${row.mailto}`);
    console.log("");
  }
  console.log(`Total drafts: ${out.length}`);
}
