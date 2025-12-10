import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('GetImage route', () => {
  beforeEach(() => {
    ;(globalThis as any).defineEventHandler = (h: any) => h
    ;(globalThis as any).getQuery = (e: any) => e?.query || {}
  })

  it('returns Response with image data when ok', async () => {
    ;(process as any).env = { ...(process as any).env, GithubImagePAT: 'pat', GithubImageOwner: 'o', GithubImageRepo: 'r' }
    ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'image/png' : null) },
      arrayBuffer: async () => new Uint8Array([1,2,3]).buffer,
    })
    const handler = (await import('../server/routes/GetImage.ts')).default as any
    const res = await handler({ query: { id: 'abc' } } as any)
    expect(res).toBeInstanceOf(Response)
    expect(res.headers.get('Content-Type')).toBe('image/png')
  })

  it('returns Result when missing PAT', async () => {
    ;(process as any).env = { ...(process as any).env, GithubImagePAT: '' }
    const handler = (await import('../server/routes/GetImage.ts')).default as any
    const res = await handler({ query: { id: 'abc' } } as any)
    expect(res.Success).toBe(false)
  })
})
