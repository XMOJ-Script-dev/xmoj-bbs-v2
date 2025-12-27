import { H3Event } from 'h3'
import { Result } from '../utils/resultUtils'
import { Output } from '../utils/output'

// Fetch raw image by id/path from GitHub
export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = getQuery(event)?.id as string | undefined
    const pathRaw = getQuery(event)?.path as string | undefined
    const repoOwner = process.env.GithubImageOwner || 'XMOJ-Script-dev'
    const repoName = process.env.GithubImageRepo || 'xmoj-bbs-images'
    const pat = process.env.GithubImagePAT
    if (!pat) return new Result(false, 'Missing GithubImagePAT')

    let path = pathRaw;
    // Decode path first, then validate to prevent %2e%2e bypasses
    if (path) {
      try {
        path = decodeURIComponent(path);
      } catch (e) {
        return new Result(false, 'Invalid path encoding');
      }
    }

    // Validate path doesn't contain traversal sequences AFTER decoding
    if (path && (path.includes('..') || path.includes('//') || !path.startsWith('images/'))) {
      return new Result(false, 'Invalid path')
    }
    // Validate id is UUID format
    if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return new Result(false, 'Invalid id')
    }

    const targetPath = path || (id ? `images/${id}` : null)
    if (!targetPath) return new Result(false, 'Missing id or path')

    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${encodeURIComponent(targetPath)}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${pat}` }, signal: controller.signal })
    if (!res.ok) {
      const t = await res.text()
      Output.Error('GetImage: ' + t)
      return new Result(false, `GitHub fetch failed: ${res.status}`)
    }
    clearTimeout(timeout)
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const arrayBuf = await res.arrayBuffer()
    return new Response(new Uint8Array(arrayBuf), {
      headers: { 'Content-Type': contentType }
    })
  } catch (err: any) {
    Output.Error('GetImage: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
