import { describe, it, expect, beforeEach } from 'vitest'

beforeEach(() => {
  ;(globalThis as any).eventHandler = (h: any) => h
})

describe('GetMailList route', () => {
  it('builds list with last message and unread count', async () => {
    const selects: Record<string, any[]> = {
      // distinct usernames from sent and received
      recv_from: [{ message_from: 'alice' }],
      sent_to: [{ message_to: 'alice' }],
      last_from: [{ content: 'hello', send_time: 100, message_from: 'alice', message_to: 'me' }],
      last_to: [{ content: 'hi', send_time: 200, message_from: 'me', message_to: 'alice' }],
    }
    let _selectCall = 0
    const db = {
      Select: async (_table: string, cols: string[], cond?: any, other?: any, _distinct?: boolean) => {
        _selectCall++
        if (_table === 'short_message' && cols[0] === 'message_from') return { Success: true, Data: selects.recv_from }
        if (_table === 'short_message' && cols[0] === 'message_to') return { Success: true, Data: selects.sent_to }
        if (other?.Limit === 1 && cond?.message_from === 'alice' && cond?.message_to === 'me') return { Success: true, Data: selects.last_from }
        if (other?.Limit === 1 && cond?.message_from === 'me' && cond?.message_to === 'alice') return { Success: true, Data: selects.last_to }
        return { Success: true, Data: [] }
      },
      GetTableSize: async (_table: string, _cond?: any) => ({ Success: true, Data: { TableSize: 3 } }),
    }

    const handler = (await import('../server/routes/GetMailList.ts')).default as any
    const res = await handler({ context: { auth: { username: 'me', database: db }, cloudflare: { env: { xssmseetee_v1_key: 'k' } } } } as any)
    expect(res.Success).toBe(true)
    const list = (res.Data as any).MailList
    expect(list.length).toBe(1)
    expect(list[0].OtherUser).toBe('alice')
    expect(typeof list[0].LastsMessage).toBe('string')
    expect(list[0].UnreadCount).toBe(3)
  })
})
