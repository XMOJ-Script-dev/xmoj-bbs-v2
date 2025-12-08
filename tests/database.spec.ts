import { describe, it, expect } from 'vitest';
import { Database } from '../server/utils/database';

class FakeD1 {
  prepare(q: string) { return { bind: (...args: any[]) => ({ all: async () => ({ results: [], meta: {} }) }) } }
}

describe('Database validation', () => {
  const db = new Database(new FakeD1() as any);
  it('rejects invalid table names', async () => {
    await expect(db.Select('bad_table' as any, [])).rejects.toThrow();
  });
  it('rejects invalid column names', async () => {
    await expect(db.Select('bbs_post', ['notacol'] as any)).rejects.toThrow();
  });
});
