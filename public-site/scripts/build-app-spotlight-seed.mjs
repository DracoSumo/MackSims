import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const sourceRoot = process.env.MACKSIMS_SOURCE_ROOT
  || "C:/Users/draco/Downloads/MackSims";

const queuePath = path.join(sourceRoot, "docs/social-assets/macksims-instagram-content-queue-2026-08.json");
const manifestPath = path.join(sourceRoot, "docs/social-assets/instagram-app-weeks/manifest.json");
const mediaRoot = path.join(sourceRoot, "public-site/public/social/instagram/app-weeks");

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const mediaByFolder = new Map();
for (const entry of manifest) {
  const list = mediaByFolder.get(entry.folder) || [];
  list.push(entry);
  mediaByFolder.set(entry.folder, list);
}

function folderFromAssetPath(assetPath) {
  return assetPath
    .replace(/^docs\/social-assets\/instagram-app-weeks\//, "")
    .replace(/\/$/, "");
}

function sqlString(value) {
  return value.replace(/'/g, "''");
}

function dollarQuote(value) {
  let tag = "caption";
  let n = 0;
  while (value.includes(`$${tag}$`)) {
    n += 1;
    tag = `caption${n}`;
  }
  return `$${tag}$${value}$${tag}$`;
}

const drafts = queue.items.map((item) => {
  const folder = folderFromAssetPath(item.assetPath);
  const slides = mediaByFolder.get(folder);
  if (!slides?.length) {
    throw new Error(`No slides for ${item.queueId} folder ${folder}`);
  }
  for (const slide of slides) {
    const jpg = path.join(mediaRoot, slide.jpg);
    if (!fs.existsSync(jpg)) {
      throw new Error(`Missing media file: ${jpg}`);
    }
  }
  const scheduledAt = new Date(item.scheduledAtLocal).toISOString();
  return {
    label: item.id,
    idempotencyKey: `${item.queueId}-carousel-v1`,
    id: item.queueId,
    scheduledAt,
    contentType: "CAROUSEL",
    caption: item.caption,
    media: slides.map((slide) => ({
      url: `https://www.macksims.com/social/instagram/app-weeks/${slide.jpg.replace(/\\/g, "/")}`,
      altText: slide.alt,
      mediaType: "IMAGE",
    })),
  };
});

const payload = { drafts: drafts.map(({ label, idempotencyKey, scheduledAt, contentType, caption, media }) => ({
  label,
  idempotencyKey,
  scheduledAt,
  contentType,
  caption,
  media,
})) };

const payloadOut = path.join(repoRoot, "public-site/scripts/instagram-draft-seed-payload.json");
fs.writeFileSync(payloadOut, `${JSON.stringify(payload, null, 2)}\n`);

const archiveSql = `-- Archive generic lineup / help-shape drafts superseded by the app spotlight series.
-- Keep the published welcome post unchanged.

ALTER TABLE instagram_publish_queue
  DROP CONSTRAINT IF EXISTS instagram_publish_queue_state_check;

ALTER TABLE instagram_publish_queue
  ADD CONSTRAINT instagram_publish_queue_state_check
  CHECK (state IN ('draft', 'approved', 'processing', 'published', 'failed', 'archived'));

ALTER TABLE instagram_publish_queue
  DROP CONSTRAINT IF EXISTS instagram_publish_queue_approval_consistency;

ALTER TABLE instagram_publish_queue
  ADD CONSTRAINT instagram_publish_queue_approval_consistency
  CHECK (
    state IN ('draft', 'archived')
    OR (approved_at IS NOT NULL AND approved_by IS NOT NULL)
  );

WITH archived AS (
  UPDATE instagram_publish_queue
  SET state = 'archived',
      updated_at = now()
  WHERE id IN ('ms-ig-004-lineup', 'ms-ig-009-help-shape-apps')
    AND state = 'draft'
  RETURNING id, state
)
INSERT INTO instagram_publish_audit (
  queue_id,
  action,
  from_state,
  to_state,
  actor,
  details
)
SELECT
  id,
  'archived',
  'draft',
  'archived',
  'app-spotlight-series-2026-07-30',
  '{"reason":"replaced-by-community-led-app-weeks"}'::jsonb
FROM archived;
`;

function insertBlock(draft) {
  const mediaSql = draft.media
    .map(
      (m) => `      jsonb_build_object(
        'url', '${sqlString(m.url)}',
        'altText', '${sqlString(m.altText)}',
        'mediaType', 'IMAGE'
      )`,
    )
    .join(",\n");

  return `WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    '${sqlString(draft.id)}',
    'draft',
    '${draft.scheduledAt}',
    ${dollarQuote(draft.caption)},
    'CAROUSEL',
    jsonb_build_array(
${mediaSql}
    ),
    '${sqlString(draft.idempotencyKey)}'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;`;
}

const seedSql = `-- Seed 12 community-led app spotlight drafts (FishCrew → ShutterBid → CurbCue → MotoCrew).
-- All records remain drafts until human approval. Week 1 should be approved only after visual review.

${drafts.map(insertBlock).join("\n\n")}
`;

const migrationsDir = path.join(repoRoot, "public-site/netlify/database/migrations");
fs.writeFileSync(path.join(migrationsDir, "20260730210000_archive_generic_instagram_drafts.sql"), archiveSql);
fs.writeFileSync(path.join(migrationsDir, "20260730211000_seed_app_spotlight_instagram_drafts.sql"), seedSql);

console.log(`Wrote ${drafts.length} drafts to payload + migrations.`);
for (const draft of drafts) {
  console.log(`- ${draft.id} ${draft.scheduledAt} (${draft.media.length} slides)`);
}
