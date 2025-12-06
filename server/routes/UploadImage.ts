import { H3Event, readBody } from 'h3'
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkPrams'
import { Output } from '../utils/output'

// Uploads a base64 image to GitHub via PAT and returns an ID
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const required = ['Authentication', 'Data']
    const check = CheckParams(body, required)
    if (!check.success) return new Result(false, null, check.message)

    const { Authentication, Data } = body
    const pat = process.env.GithubImagePAT
    const repoOwner = process.env.GithubImageOwner || 'XMOJ-Script-dev'
    const repoName = process.env.GithubImageRepo || 'xmoj-bbs-images'
    if (!pat) return new Result(false, null, 'Missing GithubImagePAT')

    const { filename, base64 } = Data || {}
    if (!base64) return new Result(false, null, 'Missing base64 image data')

    const now = Date.now()
    const id = `${now}-${Math.random().toString(36).slice(2, 8)}`
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
      Output.error('UploadImage', t)
      return new Result(false, null, `GitHub upload failed: ${res.status}`)
    }

    return new Result(true, { id, path: targetPath }, 'OK')
  } catch (err: any) {
    Output.error('UploadImage', err?.message || String(err))
    return new Result(false, null, 'Unexpected error')
  }
})
