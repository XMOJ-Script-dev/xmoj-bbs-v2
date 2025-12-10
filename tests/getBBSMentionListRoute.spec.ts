import { describe, it, expect, beforeEach } from 'vitest'

beforeEach(() => {
  ;(globalThis as any).eventHandler = (h: any) => h
  ;(globalThis as any).readBody = async () => ({ Data: { Limit: 10, Offset: 0 } })
})

describe('GetBBSMentionList route', () => {
  it('returns mentions with page numbers', async () => {
    const db = {
      Select: async (_t: string, _cols: string[], _cond?: any, _other?: any) => ({
        Success: true,
        Data: [
          { bbs_mention_id: 1, post_id: 10, bbs_mention_time: 123, reply_id: 77 },
        ],
      }),
    }

    const RawDatabase = {
      prepare: (sql: string) => ({
        bind: (...args: any[]) => ({
          all: async () => {
            if (sql.startsWith('SELECT post_id')) {
              // posts IN query
              return { results: [{ post_id: 10, user_id: 'u', title: 'T' }], meta: {} }
            }
            return { results: [], meta: {} }
          },
          run: async () => ({ results: [{ position: 1 }], meta: {} }),
        }),
      }),
    }

    const handler = (await import('../server/routes/GetBBSMentionList.ts')).default as any
    const res = await handler({ context: { auth: { username: 'me', database: { ...db, RawDatabase } } } } as any)
    expect(res.Success).toBe(true)
    const list = (res.Data as any).MentionList
    expect(list.length).toBe(1)
    expect(list[0].PostID).toBe(10)
    expect(list[0].PageNumber).toBe(1)
  })
})
