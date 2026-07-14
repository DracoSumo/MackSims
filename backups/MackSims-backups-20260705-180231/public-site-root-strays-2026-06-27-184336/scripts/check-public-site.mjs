import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredRoutes = [
  "index.html",
  "privacy/index.html",
  "terms/index.html",
  "support/index.html",
  "account-deletion/index.html",
  "beta/index.html",
  "shutterbid/index.html",
  "fishcrew/index.html"
];

const requiredCopy = [
  "support@macksims.com",
  "ShutterBid",
  "FishCrew",
  "FairShare",
  "MotoCrew",
  "beta",
  "mock",
  "account deletion"
];

const failures = [];

for (const route of requiredRoutes) {
  const filePath = join(root, route);
  try {
    const file = statSync(filePath);
    if (!file.isFile()) failures.push(`${route} is not a file`);
    const html = readFileSync(filePath, "utf8");
    if (!html.includes("<title>")) failures.push(`${route} is missing a title`);
    if (!html.includes("/styles.css")) failures.push(`${route} is missing shared styles`);
  } catch {
    failures.push(`${route} is missing`);
  }
}

const combined = requiredRoutes
  .map((route) => readFileSync(join(root, route), "utf8"))
  .join("\n");

for (const phrase of requiredCopy) {
  if (!combined.toLowerCase().includes(phrase.toLowerCase())) {
    failures.push(`Missing required public-readiness copy: ${phrase}`);
  }
}

const prohibitedClaims = [
  "payments are production-ready",
  "gps is production-ready",
  "background location is production-ready",
  "live moderation is production-ready",
  "emergency service is production-ready"
];

for (const claim of prohibitedClaims) {
  if (combined.toLowerCase().includes(claim)) {
    failures.push(`Prohibited production-readiness claim found: ${claim}`);
  }
}

if (failures.length) {
  console.error("MackSims public site check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`MackSims public site check passed for ${requiredRoutes.length} routes.`);
