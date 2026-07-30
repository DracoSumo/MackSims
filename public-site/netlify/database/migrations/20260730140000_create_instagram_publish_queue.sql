CREATE TABLE instagram_publish_queue (
  id text PRIMARY KEY,
  state text NOT NULL DEFAULT 'draft'
    CHECK (state IN ('draft', 'approved', 'processing', 'published', 'failed')),
  scheduled_at timestamptz NOT NULL,
  caption varchar(2200) NOT NULL DEFAULT '',
  content_type text NOT NULL
    CHECK (content_type IN ('IMAGE', 'CAROUSEL', 'REELS')),
  media jsonb NOT NULL,
  approved_at timestamptz,
  approved_by varchar(200),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error text,
  meta_container_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  meta_media_id text,
  idempotency_key varchar(200) NOT NULL UNIQUE,
  processing_started_at timestamptz,
  lock_token text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  CONSTRAINT instagram_publish_queue_approval_consistency CHECK (
    state = 'draft' OR (approved_at IS NOT NULL AND approved_by IS NOT NULL)
  ),
  CONSTRAINT instagram_publish_queue_media_array CHECK (jsonb_typeof(media) = 'array')
);

CREATE INDEX instagram_publish_queue_dispatch_idx
  ON instagram_publish_queue (scheduled_at, created_at)
  WHERE state = 'approved';

CREATE INDEX instagram_publish_queue_recent_publish_idx
  ON instagram_publish_queue (published_at)
  WHERE state = 'published';

CREATE TABLE instagram_publish_audit (
  id bigserial PRIMARY KEY,
  queue_id text NOT NULL REFERENCES instagram_publish_queue(id) ON DELETE CASCADE,
  action varchar(80) NOT NULL,
  from_state text,
  to_state text,
  actor varchar(200) NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX instagram_publish_audit_queue_idx
  ON instagram_publish_audit (queue_id, created_at);
