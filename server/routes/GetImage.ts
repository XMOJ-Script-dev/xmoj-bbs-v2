import { H3Event } from 'h3'
import { Result } from '../utils/resultUtils'
import { Output } from '../utils/output'

// Fetch raw image by id/path from GitHub
export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = getQuery(event)?.id as string | undefined
    const path = getQuery(event)?.path as string | undefined
    const repoOwner = process.env.GithubImageOwner || 'XMOJ-Script-dev'
    const repoName = process.env.GithubImageRepo || 'xmoj-bbs-images'
    const pat = process.env.GithubImagePAT
    if (!pat) return new Result(false, null, 'Missing GithubImagePAT')

    const targetPath = path || (id ? `images/${id}` : null)
    if (!targetPath) return new Result(false, null, 'Missing id or path')

    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${encodeURIComponent(targetPath)}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } })
    if (!res.ok) {
      const t = await res.text()
      Output.error('GetImage', t)
      return new Result(false, null, `GitHub fetch failed: ${res.status}`)
    }
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const arrayBuf = await res.arrayBuffer()
    return new Response(new Uint8Array(arrayBuf), {
      headers: { 'Content-Type': contentType }
    })
  } catch (err: any) {
    Output.error('GetImage', err?.message || String(err))
    return new Result(false, null, 'Unexpected error')
  }
})
