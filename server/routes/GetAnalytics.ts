import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkParams'
import { Output } from '../utils/output'
import { IsAdminAsync } from '../utils/auth'

// Executes a query against Cloudflare Analytics Engine
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const check = CheckParams(body, { Authentication: 'object', Data: 'object' })
    if (!check.Success) return new Result(false, check.Message)

    const { auth } = event.context
    // Only admins can execute analytics queries
    if (!(await IsAdminAsync(auth.username, auth.database))) {
      return new Result(false, "权限不足")
    }

    const { Data } = body
    const sql = (Data?.sql as string) || ''
    if (!sql) return new Result(false, 'Missing SQL')

    const accountId = process.env.ACCOUNT_ID
    const apiToken = process.env.API_TOKEN
    const dataset = (process.env as any).AnalyticsDataset || 'xmoj_bbs'
    if (!accountId || !apiToken) return new Result(false, 'Missing ACCOUNT_ID or API_TOKEN')

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        sql,
        dataset,
      }),
    })

    if (!res.ok) {
      const t = await res.text()
      Output.Error('GetAnalytics: ' + t)
      return new Result(false, `Analytics query failed: ${res.status}`)
    }

    clearTimeout(timeout)
    const data = await res.json() as Record<string, any>
    return new Result(true, 'OK', data)
  } catch (err: any) {
    Output.Error('GetAnalytics: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
