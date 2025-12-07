import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkPrams'
import { Output } from '../utils/output'

// Executes a query against Cloudflare Analytics Engine
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const required = ['Authentication', 'Data']
    const check = CheckParams(body, required)
    if (!check.success) return new Result(false, null, check.message)

    const { Data } = body
    const sql = (Data?.sql as string) || ''
    if (!sql) return new Result(false, 'Missing SQL')

    const accountId = process.env.ACCOUNT_ID
    const apiToken = process.env.API_TOKEN
    const dataset = process.env.AnalyticsDataset || 'xmoj_bbs'
    if (!accountId || !apiToken) return new Result(false, 'Missing ACCOUNT_ID or API_TOKEN')

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
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

    const data = await res.json()
    return new Result(true, 'OK', data)
  } catch (err: any) {
    Output.Error('GetAnalytics: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
