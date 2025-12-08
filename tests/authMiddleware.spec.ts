import { describe, it, expect, vi } from 'vitest';
import { Result } from '../server/utils/resultUtils';
import { Database } from '../server/utils/database';
import { CheckToken } from '../server/utils/auth';

vi.mock('../server/utils/auth', async (orig) => {
  const mod = await orig();
  return { ...mod, CheckToken: vi.fn(async () => new Result(true, '令牌匹配')) };
});

describe('Auth middleware', () => {
  it('stores auth context on success', async () => {
    const cloudflare = { env: { DB: { prepare: () => ({ bind: () => ({ all: async () => ({ results: [], meta: {} }) }) }) } } } } as any;
    const DatabaseCls = Database as any;
    const XMOJDatabase = new DatabaseCls(cloudflare.env.DB);
    const event: any = { method: 'POST', path: '/SendMail', context: { cloudflare } };

    const body = { Authentication: { SessionID: 'abc', Username: 'u' }, Data: {} };
    (globalThis as any).readBody = vi.fn(async () => body);

    // Import middleware default
    const mw = (await import('../server/middleware/1.auth.ts')).default as any;
    await mw(event);
    expect(event.context.auth.username).toBe('u');
    expect(event.context.auth.database).toBeTruthy();
  });
});
