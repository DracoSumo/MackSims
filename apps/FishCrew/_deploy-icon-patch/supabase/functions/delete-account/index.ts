// Deletes the signed-in user's FishCrew account: their data (delete_own_account, run as them) and
// then their login (auth.users), which only the service role can remove.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const auth = req.headers.get("Authorization") ?? "";
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });

  const { data: who, error: whoErr } = await asUser.auth.getUser();
  if (whoErr || !who?.user) return json({ error: "Sign in again, then delete your account." }, 401);

  const { error: dataErr } = await asUser.rpc("delete_own_account");
  if (dataErr) return json({ error: "Couldn't delete your data. Nothing was removed from your login yet.", detail: dataErr.message }, 500);

  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error: authErr } = await admin.auth.admin.deleteUser(who.user.id);
  if (authErr) return json({ error: "Your data was deleted, but the login couldn't be removed. Contact support.", detail: authErr.message }, 500);

  return json({ ok: true });
});
