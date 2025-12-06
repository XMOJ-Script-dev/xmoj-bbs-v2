import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkPrams'

// Trivial endpoint used by clients to validate connectivity
export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const required = ['Authentication']
  const check = CheckParams(body, required)
  if (!check.success) return new Result(false, null, check.message)
  return new Result(true, { ok: true }, 'OK')
})
