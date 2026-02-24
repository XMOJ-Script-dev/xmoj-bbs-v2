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
 * HTTP Polling endpoint for notifications (WebSocket fallback)
 * Maintains backward compatibility with old Process.ts client
 * Since Cloudflare Workers HTTP doesn't support WebSocket upgrades,
 * we provide an HTTP polling endpoint instead.
 * 
 * Route: GET /ws/notifications?SessionID=<sessionId>
 * 
 * Usage:
 * - Client sends GET request with SessionID
 * - Server responds with JSON containing notifications
 * - Client polls periodically to receive notifications
 * 
 * Response format:
 * {
 *   notifications: [
 *     {
 *       type: "bbs_mention" | "mail_mention",
 *       data: { ... }
 *     }
 *   ]
 * }
 */

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const sessionID = query.SessionID as string;

  if (!sessionID) {
    return new Response(JSON.stringify({ error: 'Missing SessionID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For now, return empty notifications
  // In a production setup with state management, would retrieve from KV/Durable Objects
  return new Response(JSON.stringify({
    notifications: [],
    sessionID
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});
