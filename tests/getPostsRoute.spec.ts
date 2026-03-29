import { describe, it, expect, beforeEach } from 'vitest'

// Provide a minimal eventHandler global used by the route
beforeEach(() => {
  ;(globalThis as any).eventHandler = (h: any) => h
  ;(globalThis as any).readBody = async () => ({
    Authentication: {},
    Data: { ProblemID: 0, BoardID: -1, Page: 1, Limit: 10 },
  })
})

describe('GetPosts route', () => {
  it('maps SQL results to response', async () => {
    const fakeRaw = {
      prepare: (sql: string) => ({
        bind: (..._args: any[]) => ({
          all: async () =>
            sql.startsWith('SELECT COUNT(*)')
              ? { results: [{ 'COUNT(*)': 1 }], meta: {} }
              : {
                  results: [
                    {
                      post_id: 1,
                      user_id: 'u1',
                      problem_id: 0,
                      title: 'Hello',
                      post_time: 111,
                      board_id: 2,
                      board_name: 'b2',
                      reply_count: 3,
                      last_reply_user_id: 'u2',
                      last_reply_time: 222,
                      lock_person: null,
                      lock_time: null,
                    },
                  ],
                  meta: {},
                },
        }),
      }),
    }

    const db = {
      // Select used by PageCount: return COUNT(*)
      GetTableSize: async (_t: string, _c?: any) => ({ Success: true, Data: { TableSize: 1 } }),
      ExecuteComplexQuery: async (_sql: string, _args: any[]) => ({
        Success: true,
        Data: await (fakeRaw as any).prepare('').bind().all(),
      }),
    }

    const handler = (await import('../server/routes/GetPosts.ts')).default as any
    const res = await handler({ context: { auth: { database: db } } } as any)
    expect(res.Success).toBe(true)
    const d = res.Data as any
    expect(Array.isArray(d.Posts)).toBe(true)
    expect(d.Posts[0].Title).toBe('Hello')
    expect(d.Posts[0].Lock.Locked).toBe(false)
  })
})
