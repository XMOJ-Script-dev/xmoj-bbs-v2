import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkPrams'
import { Output } from '../utils/output'

// Uploads a base64 image to GitHub via PAT and returns an ID
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
       if (!event.context?.auth) {
         return new Result(false, "未认证");
       }
    const required = ['Authentication', 'Data']
    const check = CheckParams(body, required)
    if (!check.Success) return new Result(false, check.Message)

    const { Data } = body
    const { cloudflare } = event.context
    const pat = cloudflare.env.GithubImagePAT
    const repoOwner = cloudflare.env.GithubImageOwner || 'XMOJ-Script-dev'
    const repoName = cloudflare.env.GithubImageRepo || 'xmoj-bbs-images'
    if (!pat) return new Result(false, 'Missing GithubImagePAT')

    const { filename, base64 } = Data || {}
    if (!base64) return new Result(false, 'Missing base64 image data')

    const now = Date.now()
    const id = crypto.randomUUID()
    const targetPath = `images/${id}${filename ? '_' + filename : ''}`

    const content = base64.replace(/^data:[^;]+;base64,/, '')

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(targetPath)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: `Upload image ${targetPath}`,
        content,
      }),
    })

    if (!res.ok) {
      const t = await res.text()
      Output.Error('UploadImage: ' + t)
      return new Result(false, `GitHub upload failed: ${res.status}`)
    }

    return new Result(true, 'OK', { id, path: targetPath })
  } catch (err: any) {
    Output.Error('UploadImage: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
