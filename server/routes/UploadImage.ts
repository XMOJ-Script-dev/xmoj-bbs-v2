/*
 *     Copyright (C) 2023-2025  XMOJ-bbs contributors
 *     This file is part of XMOJ-bbs.
 *     XMOJ-bbs is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     XMOJ-bbs is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with XMOJ-bbs.  If not, see <https://www.gnu.org/licenses/>.
 */

declare function readBody(event: any): Promise<any>
import { Result } from '../utils/resultUtils'
import { CheckParams } from '../utils/checkParams'
import { Output } from '../utils/output'

// Uploads a base64 image to GitHub via PAT and returns an ID
export default defineEventHandler(async (event: any) => {
  try {
    // Check authentication before reading body
    if (!event.context?.auth) {
      return new Result(false, "未认证");
    }

    const body = await readBody(event)
    const bodyCheck = CheckParams(body, { Data: 'object' })
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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
      },
      signal: controller.signal,
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

    clearTimeout(timeout)
    return new Result(true, 'OK', { id, path: targetPath })
  } catch (err: any) {
    Output.Error('UploadImage: ' + (err?.message || String(err)))
    return new Result(false, 'Unexpected error')
  }
})
