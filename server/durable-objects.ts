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

interface Notification {
  id: number
  userId: string
  type: 'bbs_mention' | 'mail_mention'
  data: Record<string, any>
  timestamp: number
}

/**
 * NotificationManager Durable Object
 * Handles user notifications using D1 database
 * Supports BBS mentions and mail mentions
 */
export class NotificationManager {
  private state: DurableObjectState
  private env: any
  private notificationPushToken: string = ''

  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.env = env
    // Get notification token from environment
    this.notificationPushToken = (env as any)?.NOTIFICATION_PUSH_TOKEN || ''
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname
    const method = request.method

    try {
      // Route: POST /notify - Add notification (compatible with Process.ts)
      if (pathname === '/notify' && method === 'POST') {
        return await this.handleNotify(request)
      }

      // Route: GET /list/:userId - Get user notifications
      if (pathname.match(/^\/list\/[^/]+$/) && method === 'GET') {
        return await this.handleList(request)
      }

      // Route: DELETE /:notificationId - Delete notification
      if (pathname.match(/^\/\d+$/) && method === 'DELETE') {
        return await this.handleDelete(request)
      }

      // Route: DELETE /user/:userId/:type - Delete all notifications of type for user
      if (pathname.match(/^\/user\/[^/]+\/(bbs_mention|mail_mention)$/) && method === 'DELETE') {
        return await this.handleDeleteByType(request)
      }

      return new Response('Not Found', { status: 404 })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  /**
   * Handle notify endpoint (compatible with Process.ts)
   * Validates X-Notification-Token if configured
   */
  private async handleNotify(request: Request): Promise<Response> {
    // Validate token if configured (for security, matching Process.ts behavior)
    if (this.notificationPushToken) {
      const token = request.headers.get('X-Notification-Token')
      if (token !== this.notificationPushToken) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    const { userId, notification, type, data } = await request.json() as {
      userId: string
      notification?: Record<string, any>
      type?: 'bbs_mention' | 'mail_mention'
      data?: Record<string, any>
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Support both old format (notification) and new format (type + data)
    const notificationType = type || (notification as any)?.type || 'unknown'
    const notificationData = data || notification || {}

    // Store notification in isolation storage
    const notificationId = await this.state.blockConcurrencyWhile(async () => {
      const counter = await this.state.storage?.get<number>('notificationCounter') || 0
      const newId = counter + 1
      await this.state.storage?.put('notificationCounter', newId)
      return newId
    })

    const storedNotification: Notification = {
      id: notificationId,
      userId,
      type: notificationType as 'bbs_mention' | 'mail_mention',
      data: notificationData,
      timestamp: Date.now()
    }

    const key = `notification:${userId}:${notificationId}`
    await this.state.storage?.put(key, JSON.stringify(storedNotification))

    return new Response(JSON.stringify({ success: true, id: notificationId }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Handle list notifications
   * Returns all notifications for a user
   */
  private async handleList(request: Request): Promise<Response> {
    const userId = new URL(request.url).pathname.split('/').pop()
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const notifications: Notification[] = []

    // List all keys for this user and retrieve notifications
    const list = await this.state.storage?.list({ prefix: `notification:${userId}:` })
    if (list) {
      for (const [, value] of list) {
        const notification: Notification = JSON.parse(value as string)
        notifications.push(notification)
      }
    }

    // Sort by timestamp descending (newest first)
    notifications.sort((a, b) => b.timestamp - a.timestamp)

    return new Response(JSON.stringify({ success: true, notifications }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Handle delete notification
   * Deletes a specific notification by ID
   */
  private async handleDelete(request: Request): Promise<Response> {
    const parts = new URL(request.url).pathname.split('/')
    const notificationId = Number(parts[parts.length - 1])
    const userId = new URL(request.url).searchParams.get('userId')

    if (!userId || !notificationId) {
      return new Response(JSON.stringify({ error: 'userId and notificationId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const key = `notification:${userId}:${notificationId}`
    await this.state.storage?.delete(key)

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Handle delete by type
   * Deletes all notifications of a specific type for a user
   */
  private async handleDeleteByType(request: Request): Promise<Response> {
    const parts = new URL(request.url).pathname.split('/')
    const userId = parts[parts.length - 2]
    const type = parts[parts.length - 1] as 'bbs_mention' | 'mail_mention'

    if (!userId || !type) {
      return new Response(JSON.stringify({ error: 'userId and type required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // List and delete notifications of this type for user
    const list = await this.state.storage?.list({ prefix: `notification:${userId}:` })
    const keysToDelete: string[] = []

    if (list) {
      for (const [key, value] of list) {
        const notification: Notification = JSON.parse(value as string)
        if (notification.type === type) {
          keysToDelete.push(key)
        }
      }
    }

    for (const key of keysToDelete) {
      await this.state.storage?.delete(key)
    }

    return new Response(JSON.stringify({ success: true, deleted: keysToDelete.length }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
