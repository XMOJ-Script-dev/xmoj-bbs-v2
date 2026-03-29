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

    // Validate SQL query against allowed patterns to prevent arbitrary data exfiltration
    // Only allow safe readonly analytics queries, not full data acess
    const allowedQueryPatterns = [
      /^SELECT\s+COUNT\(\*\)\s+FROM\s/i,  // COUNT(*) from tables
      /^SELECT\s+COUNT\(DISTINCT\s+\w+\)\s+FROM\s/i,  // COUNT(DISTINCT col)
      /^SELECT\s+\w+\s+FROM\s+\w+\s+WHERE/i,  // Simple WHERE queries
      /^SELECT\s+percentiles/i,  // Percentile queries
      /^SELECT\s+quantiles/i,  // Quantile queries
    ];
    
    const queryModified = sql.trim().toUpperCase();
    const isAllowed = allowedQueryPatterns.some(pattern => pattern.test(queryModified));
    
    if (!isAllowed) {
      Output.Warn(`Analytics query blocked - pattern not whitelisted: ${sql.substring(0, 100)}`);
      return new Result(false, 'Query pattern not allowed for security reasons. Use standard analytics queries (COUNT, percentiles, quantiles)');
    }

    const { cloudflare } = event.context;
    const accountId = cloudflare.env.ACCOUNT_ID
    const apiToken = cloudflare.env.API_TOKEN
    const dataset = cloudflare.env.AnalyticsDataset || 'xmoj_bbs'
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
