import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckToken } from '../server/utils/auth';

class MockDatabase {
  private store: Record<string, any[]> = {};
  async Select(table: string, cols: string[], cond?: any) {
    const rows = (this.store[table] || []).filter(r => {
      return !cond || Object.keys(cond).every(k => r[k] === (cond[k]?.Value ?? cond[k]));
    });
    return { Success: true, Message: 'ok', Data: rows } as any;
  }
  async Insert(table: string, data: any) {
    this.store[table] = this.store[table] || [];
    this.store[table].push(data);
    return { Success: true, Data: { InsertID: this.store[table].length } } as any;
  }
  async GetTableSize(table: string, cond?: any) {
    const rows = (this.store[table] || []).filter(r => !cond || Object.keys(cond).every(k => r[k] === (cond[k]?.Value ?? cond[k])));
    return { Success: true, Data: { TableSize: rows.length } } as any;
  }
  async Delete(table: string, cond: any) {
    this.store[table] = (this.store[table] || []).filter(r => !Object.keys(cond).every(k => r[k] === (cond[k]?.Value ?? cond[k])));
    return { Success: true, Data: {} } as any;
  }
}

describe('CheckToken', () => {
  const db = new (MockDatabase as any)();
  beforeEach(() => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve("<a href='profile.php?user_id=testuser'>")
    });
  });
  it('accepts matching username', async () => {
    const res = await CheckToken('session123', 'testuser', db);
    expect(res.Success).toBe(true);
  });
  it('rejects mismatched username', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue({ text: () => Promise.resolve("<a href='profile.php?user_id=other'>") });
    const res = await CheckToken('session123', 'testuser', db);
    expect(res.Success).toBe(false);
  });
});
