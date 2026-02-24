import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  let originalFetch: any;
  
  beforeEach(() => {
    // Clear global token cache between tests
    delete (globalThis as any).__tokenCache;
    // Save original fetch and replace with mock
    originalFetch = (globalThis as any).fetch;
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve("<a href='profile.php?user_id=testuser'>")
    });
  });
  
  afterEach(() => {
    // Restore original fetch to prevent undici errors
    if (originalFetch !== undefined) {
      (globalThis as any).fetch = originalFetch;
    }
  });
  
  it('accepts matching username', async () => {
    const res = await CheckToken('session123', 'testuser', db);
    expect(res.Success).toBe(true);
  });
  it('rejects mismatched username', async () => {
    // Use a different session ID to avoid cache
    (globalThis as any).fetch = vi.fn().mockResolvedValue({ 
      text: () => Promise.resolve("<a href='profile.php?user_id=other'>") 
    });
    const res = await CheckToken('session456', 'testuser', db);
    expect(res.Success).toBe(false);
  });
});
