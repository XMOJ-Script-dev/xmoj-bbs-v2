/* Auto-mounted rate limiter: runs before 1.auth.ts */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const defineEventHandler: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function readBody(event: any): Promise<any>;

const BUCKET = new Map<string, { tokens: number; last: number }>();
const CAPACITY = 30; // max 30 ops
const REFILL_PER_SEC = 10; // 10 tokens per second

export default defineEventHandler(async (event: any) => {
  if (event.method !== 'POST') return;
  let username = '';
  try {
    const body = await readBody(event);
    username = body?.Authentication?.Username || '';
  } catch {}
  const key = username || event.node?.req?.headers?.['cf-connecting-ip'] || 'anonymous';
  const now = Date.now();
  const bucket = BUCKET.get(key) || { tokens: CAPACITY, last: now };
  const elapsedSec = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSec * REFILL_PER_SEC);
  bucket.last = now;
  if (bucket.tokens < 1) {
    return { Success: false, Message: '请求过于频繁，请稍后重试' };
  }
  bucket.tokens -= 1;
  BUCKET.set(key, bucket);
});
