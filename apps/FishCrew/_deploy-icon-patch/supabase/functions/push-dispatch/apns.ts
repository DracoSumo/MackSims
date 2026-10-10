// APNs sender for Deno / Supabase Edge Functions. No dependencies.
// Env: APNS_KEY_ID, APNS_TEAM_ID, APNS_KEY (.p8 contents; literal "\n" accepted), APNS_HOST (optional).
const enc = new TextEncoder();
const b64url = (bytes: Uint8Array | string) => {
  const b = typeof bytes === 'string' ? enc.encode(bytes) : bytes;
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};
let cached: { token: string; iat: number; kid: string } | null = null;

export function apnsConfigured(env: (k: string) => string | undefined = Deno.env.get) {
  return Boolean(env('APNS_KEY_ID') && env('APNS_TEAM_ID') && env('APNS_KEY'));
}

async function importKey(pem: string) {
  const body = pem.replace(/\\n/g, '\n').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey('pkcs8', der, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

export async function apnsJwt(env: (k: string) => string | undefined = Deno.env.get, nowSec = Math.floor(Date.now() / 1000)) {
  const kid = env('APNS_KEY_ID')!;
  if (cached && cached.kid === kid && nowSec - cached.iat < 50 * 60) return cached.token;
  const header = b64url(JSON.stringify({ alg: 'ES256', kid }));
  const claims = b64url(JSON.stringify({ iss: env('APNS_TEAM_ID'), iat: nowSec }));
  const key = await importKey(env('APNS_KEY')!);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${header}.${claims}`)));
  const token = `${header}.${claims}.${b64url(sig)}`;
  cached = { token, iat: nowSec, kid };
  return token;
}

export type ApnsResult = { token: string; ok: boolean; status: number; reason?: string; dead: boolean };

export async function sendApns(
  opts: { tokens: string[]; topic: string; title: string; body: string; data?: Record<string, unknown>; threadId?: string; collapseId?: string },
  env: (k: string) => string | undefined = Deno.env.get,
): Promise<ApnsResult[]> {
  const tokens = [...new Set((opts.tokens || []).filter((t) => /^[0-9a-f]{32,200}$/i.test(String(t))))];
  if (!tokens.length) return [];
  if (!apnsConfigured(env)) return tokens.map((token) => ({ token, ok: false, status: 0, reason: 'APNS_NOT_CONFIGURED', dead: false }));
  const host = env('APNS_HOST') || 'api.push.apple.com';
  const aps: Record<string, unknown> = { alert: { title: opts.title.slice(0, 120), body: opts.body.slice(0, 400) }, sound: 'default' };
  if (opts.threadId) aps['thread-id'] = opts.threadId;
  const payload = JSON.stringify({ aps, ...(opts.data || {}) });
  const jwt = await apnsJwt(env);
  return Promise.all(tokens.map(async (token) => {
    try {
      const headers: Record<string, string> = {
        authorization: `bearer ${jwt}`, 'apns-topic': opts.topic, 'apns-push-type': 'alert', 'apns-priority': '10', 'content-type': 'application/json',
      };
      if (opts.collapseId) headers['apns-collapse-id'] = opts.collapseId.slice(0, 64);
      const res = await fetch(`https://${host}/3/device/${token}`, { method: 'POST', headers, body: payload });
      let reason: string | undefined;
      if (res.status !== 200) { try { reason = (await res.json()).reason; } catch { reason = 'NO_BODY'; } } else { await res.body?.cancel(); }
      const dead = res.status === 410 || ['BadDeviceToken', 'Unregistered', 'DeviceTokenNotForTopic'].includes(reason || '');
      return { token, ok: res.status === 200, status: res.status, reason, dead };
    } catch (e) {
      return { token, ok: false, status: 0, reason: String((e as Error)?.name || 'FETCH_ERROR'), dead: false };
    }
  }));
}
