import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkPrams'
import { Database } from '../utils/database'
import { Output } from '../utils/output'

// Returns the last online timestamp (unix seconds) for a user
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const required = ['Authentication', 'Data']
    const check = CheckParams(body, required)
    if (!check.success) return new Result(false, null, check.message)

    const { Data } = body
    const username = Data?.username as string
    if (!username) return new Result(false, null, 'Missing username')

    const db = await Database.get()
    const rs = await db.prepare(
      'SELECT timestamp FROM analytics_log WHERE username = ? ORDER BY timestamp DESC LIMIT 1'
    ).bind(username).first()

    if (!rs || !rs.timestamp) return new Result(true, { lastOnline: 0 }, 'Not found')
    const tsUnix = Math.floor(Number(rs.timestamp) / 1000)
    return new Result(true, { lastOnline: tsUnix }, 'OK')
  } catch (err: any) {
    Output.error('LastOnline', err?.message || String(err))
    return new Result(false, null, 'Unexpected error')
  }
})
