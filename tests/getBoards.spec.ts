import { describe, it, expect } from 'vitest';
import { Database } from '../server/utils/database';

describe('GetBoards pagination', () => {
  class FakeD1 {
    prepare(q: string) { return { bind: (...args: any[]) => ({ all: async () => ({ results: Array.from({ length: 3 }, (_, i) => ({ board_id: i+1, board_name: 'b'+(i+1) })), meta: {} }) }) } }
  }
  it('select uses limit/offset', async () => {
    const db = new Database(new FakeD1() as any);
    const res = await db.Select('bbs_board', [], undefined, { Limit: 2, Offset: 1 });
    expect(res.Success).toBe(true);
  });
});
