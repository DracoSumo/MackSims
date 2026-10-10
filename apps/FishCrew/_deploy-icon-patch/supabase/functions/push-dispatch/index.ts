// push-dispatch: sends one FishCrew notification to the user's iPhones.
//
// Called by the fc_notifications_push trigger (pg_net) with
//   POST { notification_id }   header x-push-secret: <Vault push_webhook_secret>
// Deploy with --no-verify-jwt: the database sends the shared secret, not a JWT.
// Env: PUSH_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      APNS_KEY_ID, APNS_TEAM_ID, APNS_KEY, APNS_HOST (optional).
import { sendApns } from './apns.ts';

const TOPIC = 'com.chrissims.fishcrew';
type Env = (k: string) => string | undefined;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function sameSecret(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function handle(req: Request, env: Env = (k) => Deno.env.get(k)): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  if (!sameSecret(req.headers.get('x-push-secret') || '', env('PUSH_WEBHOOK_SECRET') || '')) {
    return json(401, { error: 'unauthorized' });
  }
  let id = '';
  try { id = String((await req.json())?.notification_id || ''); } catch { /* empty body */ }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json(400, { error: 'notification_id' });

  const base = `${env('SUPABASE_URL')}/rest/v1`;
  const key = env('SUPABASE_SERVICE_ROLE_KEY') || '';
  const headers = { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' };
  const rest = (path: string, init: RequestInit = {}) => fetch(`${base}/${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });

  const nRes = await rest(`notifications?id=eq.${id}&select=id,user_id,title,body,entity_id,link_path,read_at`);
  if (!nRes.ok) return json(502, { error: 'load notification' });
  const n = (await nRes.json())?.[0];
  if (!n) return json(404, { error: 'not found' });
  if (n.read_at || !/^[0-9a-f-]{36}$/i.test(String(n.user_id))) return json(200, { sent: 0 });

  const dRes = await rest(`push_devices?user_id=eq.${n.user_id}&select=token`);
  if (!dRes.ok) return json(502, { error: 'load devices' });
  const tokens = ((await dRes.json()) || []).map((d: { token: string }) => d.token);
  if (!tokens.length) return json(200, { sent: 0 });

  const results = await sendApns({
    tokens,
    topic: TOPIC,
    title: String(n.title || 'FishCrew'),
    body: String(n.body || ''),
    data: { link: n.link_path || '/', notificationId: n.id },
    threadId: n.entity_id ? String(n.entity_id) : undefined,
  }, env);

  const dead = results.filter((r) => r.dead).map((r) => r.token);
  if (dead.length) await rest(`push_devices?token=in.(${dead.join(',')})`, { method: 'DELETE' });
  const failed = results.filter((r) => !r.ok && !r.dead);
  await Promise.all(failed.map((r) => rest(`push_devices?token=eq.${r.token}`, {
    method: 'PATCH',
    body: JSON.stringify({ last_error: `${r.status} ${r.reason || ''}`.trim().slice(0, 200), updated_at: new Date().toISOString() }),
  })));

  return json(200, { sent: results.filter((r) => r.ok).length, dead: dead.length, failed: failed.length });
}

Deno.serve((req) => handle(req).catch((e) => json(500, { error: String((e as Error)?.message || e) })));
