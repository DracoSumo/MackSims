import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrationPath = join(
  root,
  "supabase/migrations/20260820110000_fail_closed_sermons_series_rls.sql",
);
const schemaPath = join(root, "supabase/schema.sql");

describe("sermons/series fail-closed RLS", () => {
  const migration = readFileSync(migrationPath, "utf8");
  const schema = readFileSync(schemaPath, "utf8");

  it("enables RLS on sermons and series without client write/select policies", () => {
    expect(migration).toContain("alter table public.sermons enable row level security");
    expect(migration).toContain("alter table public.series enable row level security");
    expect(migration).toMatch(/No CREATE POLICY on sermons\/series/);
    expect(migration).not.toMatch(
      /create policy\s+"[^"]+"\s+on public\.sermons/i,
    );
    expect(migration).not.toMatch(
      /create policy\s+"[^"]+"\s+on public\.series/i,
    );
  });

  it("keeps shared catalogs readable but does not open writes", () => {
    expect(migration).toContain('create policy "songs_read"');
    expect(migration).toContain('create policy "verses_read"');
    expect(migration).toContain('create policy "verse_texts_read"');
    expect(migration).not.toMatch(/on public\.songs for (insert|update|delete|all)/i);
    expect(migration).not.toMatch(/on public\.verses for (insert|update|delete|all)/i);
  });

  it("mirrors fail-closed RLS enablement in schema.sql", () => {
    expect(schema).toContain("alter table public.sermons enable row level security");
    expect(schema).toContain("alter table public.series enable row level security");
    expect(schema).not.toMatch(
      /create policy\s+"[^"]+"\s+on public\.sermons/i,
    );
    expect(schema).not.toMatch(
      /create policy\s+"[^"]+"\s+on public\.series/i,
    );
  });
});
