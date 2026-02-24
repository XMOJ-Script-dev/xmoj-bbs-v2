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

/**
 * WebSocket notifications endpoint
 * Forwards WebSocket upgrade requests to the NotificationManager Durable Object
 * 
 * Route: GET /ws/notifications?userId=<userId>
 * Protocol: WebSocket (wss)
 */

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string || query.SessionID as string

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId or SessionID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Get Cloudflare context
  const cf = event.context.cloudflare || (globalThis as any).cloudflare
  if (!cf?.env?.NOTIFICATIONS) {
    return new Response(JSON.stringify({ error: 'Notifications service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Get the raw request from Nitro
    const req = (event as any).node?.req as any
    if (!req) {
      return new Response(JSON.stringify({ error: 'Invalid request context' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get Durable Object stub using userId as the identity
    const namespace = cf.env.NOTIFICATIONS
    const stub = namespace.get(namespace.idFromName(userId))

    // Build a proper request for the Durable Object with WebSocket headers
    const wsUrl = new URL('https://notifications/ws', 'https://notifications')
    wsUrl.searchParams.set('userId', userId)

    const doRequest = new Request(wsUrl.toString(), {
      method: req.method || 'GET',
      headers: req.headers || {}
    })

    // Forward to Durable Object - it will handle the WebSocket upgrade
    return stub.fetch(doRequest)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: `WebSocket failed: ${errorMsg}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
