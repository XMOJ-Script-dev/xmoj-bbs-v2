/* Auto-mounted rate limiter: runs before 1.auth.ts */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const defineEventHandler: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function readBody(event: any): Promise<any>;

const CAPACITY = 30; // max 30 ops
const REFILL_PER_SEC = 10; // 10 tokens per second
// Use KV for distributed rate limiting when available
type KVBinding = { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: any) => Promise<void> };

export default defineEventHandler(async (event: any) => {
  if (event.method !== 'POST') return;
  let username = '';
  try {
    const body = await readBody(event);
    username = body?.Authentication?.Username || '';
  } catch {}
  const key = username || event.node?.req?.headers?.['cf-connecting-ip'] || 'anonymous';
  const now = Date.now();
  const kv: KVBinding | undefined = event.context?.cloudflare?.env?.RATE_LIMIT_KV;
  if (kv) {
    const raw = await kv.get(`rl:${key}`);
    const state = raw ? JSON.parse(raw) as { tokens: number; last: number } : { tokens: CAPACITY, last: now };
    const elapsedSec = (now - state.last) / 1000;
    state.tokens = Math.min(CAPACITY, state.tokens + elapsedSec * REFILL_PER_SEC);
    state.last = now;
    if (state.tokens < 1) {
      return { Success: false, Message: '请求过于频繁，请稍后重试' };
    }
    state.tokens -= 1;
    await kv.put(`rl:${key}`, JSON.stringify(state), { expirationTtl: 300 }); // 5 min TTL
    return;
  }
  // Fallback: per-request transient (not persistent across workers)
  const elapsedSec = 0; // Without KV, we cannot track reliably; allow request
  void elapsedSec;
});
