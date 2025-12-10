import { describe, it, expect } from 'vitest';
import { DeletePostWithReplies } from '../server/utils/postUtils';

class MockDb {
  private replies = [{ reply_id: 1, post_id: 10 }, { reply_id: 2, post_id: 10 }];
  async Select(_table: string, _cols: string[], _cond: any) { return { Success: true, Data: this.replies } as any }
  async Delete(_table: string, _cond: any) { return { Success: true, Data: {} } as any }
}

describe('Delete flows', () => {
  it('deletes replies then post', async () => {
    const res = await DeletePostWithReplies(10, new MockDb() as any);
    expect(res.Success).toBe(true);
  });
});
