import { describe, it, expect, beforeEach, vi } from 'vitest'

let currentBody: any = {}
vi.mock('h3', async () => ({
  readBody: async () => currentBody,
  H3Event: class {},
}))

beforeEach(() => {
  ;(globalThis as any).defineEventHandler = (h: any) => h
})

describe('SendData route', () => {
  it('returns OK when Authentication present', async () => {
    currentBody = { Authentication: {} }
    const handler = (await import('../server/routes/SendData.ts')).default as any
    const res = await handler({} as any)
    expect(res.Success).toBe(true)
  })

  it('fails when Authentication missing', async () => {
    currentBody = {}
    const handler = (await import('../server/routes/SendData.ts')).default as any
    const res = await handler({} as any)
    expect(res.Success).toBe(false)
  })
})
