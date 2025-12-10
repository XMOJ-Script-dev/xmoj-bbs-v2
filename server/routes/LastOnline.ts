import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkParams'
import { Output } from '../utils/output'

// Returns the last online timestamp (unix seconds) for a user
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const check = CheckParams(body, { Authentication: 'object', Data: 'object' })
    if (!check.Success) return new Result(false, check.Message)

    const { Data } = body
    const username = Data?.username as string
    if (!username) return new Result(false, 'Missing username')

    // Use existing session records as a proxy for last online
    const { auth } = (event as any).context
    if (!auth?.database) return new Result(false, 'Auth context missing')

    const rs = (await auth.database.Select(
      'phpsessid',
      ['create_time'],
      { user_id: username },
      { Order: 'create_time', OrderIncreasing: false, Limit: 1 }
    )).Data as any

    if (!rs || !Array.isArray(rs) || rs.length === 0) {
      return new Result(true, 'Not found', { lastOnline: 0 })
    }
    const tsUnix = Math.floor(Number(rs[0]['create_time']) / 1000)
    return new Result(true, 'OK', { lastOnline: tsUnix })
  } catch (err: any) {
    Output.Error('LastOnline: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
