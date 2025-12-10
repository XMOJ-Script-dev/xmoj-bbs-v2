import { describe, it, expect, beforeEach } from 'vitest'

beforeEach(() => {
  ;(globalThis as any).eventHandler = (h: any) => h
  ;(globalThis as any).readBody = async () => ({ Data: { Limit: 2, Offset: 1 } })
})

describe('GetBoards route', () => {
  it('returns mapped boards', async () => {
    const db = {
      Select: async (_t: string, _c: string[], _cond?: any, _other?: any) => ({
        Success: true,
        Data: [
          { board_id: 1, board_name: 'General' },
          { board_id: 2, board_name: 'Help' },
        ],
      }),
    }
    const handler = (await import('../server/routes/GetBoards.ts')).default as any
    const res = await handler({ context: { auth: { database: db } } } as any)
    expect(res.Success).toBe(true)
    const boards = (res.Data as any).Boards
    expect(boards.length).toBe(2)
    expect(boards[0]).toEqual({ BoardID: 1, BoardName: 'General' })
  })
})
