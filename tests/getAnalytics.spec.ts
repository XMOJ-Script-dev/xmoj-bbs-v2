import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock h3 to control readBody
vi.mock('h3', async () => ({
  readBody: async (_e: any) => ({ Authentication: {}, Data: { sql: 'SELECT 1' } }),
  H3Event: class {},
}))

describe('GetAnalytics route', () => {
  beforeEach(() => {
    ;(globalThis as any).defineEventHandler = (h: any) => h
    // Provide env required by handler
    ;(process as any).env = { ...(process as any).env, ACCOUNT_ID: 'acc', API_TOKEN: 'tok', AnalyticsDataset: 'ds' }
    ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rows: [{ c: 1 }] }),
    })
  })

  it('returns OK with data', async () => {
    const handler = (await import('../server/routes/GetAnalytics.ts')).default as any
    const mockDatabase = {
      GetTableSize: vi.fn().mockResolvedValue({ Success: true, Data: { TableSize: 1 }, Message: 'OK' })
    }
    const res = await handler({ context: { auth: { username: 'admin', database: mockDatabase } } } as any)
    expect(res.Success).toBe(true)
    expect((res.Data as any).rows?.length).toBe(1)
  })

  it('handles failure from API', async () => {
    ;(globalThis as any).fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'err' })
    const handler = (await import('../server/routes/GetAnalytics.ts')).default as any
    const mockDatabase = {
      GetTableSize: vi.fn().mockResolvedValue({ Success: true, Data: { TableSize: 1 }, Message: 'OK' })
    }
    const res = await handler({ context: { auth: { username: 'admin', database: mockDatabase } } } as any)
    expect(res.Success).toBe(false)
  })
})
