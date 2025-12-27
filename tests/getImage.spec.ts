import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('GetImage route', () => {
  beforeEach(() => {
    ;(globalThis as any).defineEventHandler = (h: any) => h
  })

  // Mock getQuery before each test
  const mockGetQuery = (queryObj: any) => {
    ;(globalThis as any).getQuery = vi.fn().mockReturnValue(queryObj)
  }

  it('returns Response with image data when ok', async () => {
    mockGetQuery({ id: '12345678-1234-1234-1234-123456789abc' })
    ;(process as any).env = { ...(process as any).env, GithubImagePAT: 'pat', GithubImageOwner: 'o', GithubImageRepo: 'r' }
    ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'image/png' : null) },
      arrayBuffer: async () => new Uint8Array([1,2,3]).buffer,
    })
    const handler = (await import('../server/routes/GetImage.ts')).default as any
    const res = await handler({} as any)
    expect(res).toBeInstanceOf(Response)
    expect(res.headers.get('Content-Type')).toBe('image/png')
  })

  it('returns Result when missing PAT', async () => {
    mockGetQuery({ id: '12345678-1234-1234-1234-123456789abc' })
    ;(process as any).env = { ...(process as any).env, GithubImagePAT: '' }
    const handler = (await import('../server/routes/GetImage.ts')).default as any
    const res = await handler({} as any)
    expect(res.Success).toBe(false)
  })
})
