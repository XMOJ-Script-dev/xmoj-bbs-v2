// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function readBody(event: any): Promise<any>
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkParams'
import { Output } from '../utils/output'

// Uploads a base64 image to GitHub via PAT and returns an ID
export default defineEventHandler(async (event: any) => {
  try {
    const body = await readBody(event)
       if (!event.context?.auth) {
         return new Result(false, "未认证");
       }
    const bodyCheck = CheckParams(body, { Authentication: 'object', Data: 'object' })
    if (!bodyCheck.Success) return new Result(false, bodyCheck.Message)

    const { Data } = body
    const dataCheck = CheckParams(Data, { filename: 'string', base64: 'string' })
    if (!dataCheck.Success) return new Result(false, dataCheck.Message)
    const { cloudflare } = event.context
    const pat = cloudflare.env.GithubImagePAT
    const repoOwner = cloudflare.env.GithubImageOwner || 'XMOJ-Script-dev'
    const repoName = cloudflare.env.GithubImageRepo || 'xmoj-bbs-images'
    if (!pat) return new Result(false, 'Missing GithubImagePAT')

    const { filename, base64 } = Data || {}
    if (!base64) return new Result(false, 'Missing base64 image data')
    // Validate data URL format and size
    const dataUrlRegex = /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+=*$/i
    if (!dataUrlRegex.test(base64)) {
      return new Result(false, 'Invalid image data format')
    }
    const safeName = String(filename || '').slice(0, 100)
    if (!/^[A-Za-z0-9._-]*$/.test(safeName)) {
      return new Result(false, 'Invalid filename')
    }

    const now = Date.now()
    const id = crypto.randomUUID()
    const targetPath = `images/${id}${filename ? '_' + filename : ''}`

    const content = base64.replace(/^data:[^;]+;base64,/, '')
    // Approximate decoded byte length
    const padding = (content.match(/=*$/) || [''])[0].length
    const decodedBytes = Math.floor(content.length * 3 / 4) - padding
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024
    if (decodedBytes > MAX_IMAGE_BYTES) {
      return new Result(false, 'Image too large (max 5MB)')
    }

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
