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
    if (!check.Success) return new Result(false, check.Message)

    const { Data } = body
    const username = Data?.username as string
    if (!username) return new Result(false, 'Missing username')

    const db = new Database((event as any).context?.cloudflare?.env?.DB)
    const rs = await db.prepare(
      'SELECT timestamp FROM analytics_log WHERE username = ? ORDER BY timestamp DESC LIMIT 1'
    ).bind(username).first()

    if (!rs || !rs.timestamp) return new Result(true, 'Not found', { lastOnline: 0 })
    const tsUnix = Math.floor(Number(rs.timestamp) / 1000)
    return new Result(true, 'OK', { lastOnline: tsUnix })
  } catch (err: any) {
    Output.Error('LastOnline: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
