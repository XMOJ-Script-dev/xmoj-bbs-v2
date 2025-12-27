/* Auto-mounted rate limiter: runs before 1.auth.ts */
declare const defineEventHandler: any;
declare function readBody(event: any): Promise<any>;

const CAPACITY = 10; // max 10 ops (reduced from 30)
const REFILL_PER_SEC = 2; // 2 tokens per second (reduced from 10)
// Use KV for distributed rate limiting when available
type KVBinding = { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: any) => Promise<void> };

export default defineEventHandler(async (event: any) => {
  if (event.method !== 'POST') return;
  let username = '';
  try {
    const body = await readBody(event);
    username = body?.Authentication?.Username || '';
  } catch {}
  // For anonymous users, require IP address (don't fall back to 'anonymous' shared bucket)
  const ip = event.node?.req?.headers?.['cf-connecting-ip'];
  if (!username && !ip) {
    return { Success: false, Message: '无法确定请求来源，请求被拒绝' };
  }
  const key = username || ip || 'anonymous';
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
  // Fallback: global in-memory token bucket without timers; cleaned on access
  const globalBuckets: Map<string, { tokens: number; last: number }> = (globalThis as any).__rlBuckets || ((globalThis as any).__rlBuckets = new Map());
  const TTL_MS = 5 * 60 * 1000;
  // Opportunistically clean up only the accessed key if stale
  let st = globalBuckets.get(key);
  if (st && (now - st.last > TTL_MS)) {
    globalBuckets.delete(key);
    st = undefined;
  }
  st = st || { tokens: CAPACITY, last: now };
  const elapsed = (now - st.last) / 1000;
  st.tokens = Math.min(CAPACITY, st.tokens + elapsed * REFILL_PER_SEC);
  st.last = now;
  if (st.tokens < 1) {
    return { Success: false, Message: '请求过于频繁，请稍后重试' };
  }
  st.tokens -= 1;
  globalBuckets.set(key, st);
});
