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

import { defineEventHandler, readBody as h3ReadBody } from "h3";
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { Database } from "~/utils/database";
import { CheckToken } from "~/utils/auth";

export default defineEventHandler(async (event: any) => {
  const path = event.path;
  
  // Skip authentication for public endpoints
  const publicEndpoints = ["/GetNotice", "/GetAddOnScript", "/GetImage"];
  if (path === "/" || publicEndpoints.some(endpoint => path.startsWith(endpoint))) {
    return;
  }
  // Basic rate-limit middleware runs before auth for POSTs
  // Rate limiting handled by separate middleware chain when enabled
  
  // Only process POST requests with JSON body
  if (event.method !== "POST") {
    return;
  }
  
  try {
    const readBodyAny: (e: any) => Promise<any> = (globalThis as any).readBody || h3ReadBody as any;
    const body = await readBodyAny(event);
    
    // Check if body has required authentication fields
    // Rate limiting is handled separately; proceed to auth
    if (!body || typeof body !== 'object') {
      return;
    }
    const { Authentication, Version, DebugMode } = body as any;
    if (!Authentication || typeof Authentication !== 'object') {
      throw new Result(false, "认证信息不完整");
    }
    
    // Validate Authentication object
    if (!Authentication.SessionID || !Authentication.Username) {
      throw new Result(false, "认证信息不完整");
    }
    
    const { cloudflare } = event.context;
    const XMOJDatabase = new Database(cloudflare.env.DB);
    
    // Check token - fail immediately if invalid
    ThrowErrorIfFailed(await CheckToken(
      Authentication.SessionID,
      Authentication.Username,
      XMOJDatabase,
      // Pass KV if available for distributed cache
      (cloudflare.env as any).SESSION_KV
    ));
    
    // Store authenticated user info in context
    event.context.auth = {
      username: Authentication.Username,
      sessionID: Authentication.SessionID,
      database: XMOJDatabase
    };
    
    // Store request metadata
    event.context.requestMeta = {
      version: Version || "unknown",
      debugMode: DebugMode || false,
      remoteIP: (event as any)?.node?.req?.headers?.["cf-connecting-ip"] || ""
    };
    
    // Log to analytics if available
    if (cloudflare.env.logdb) {
      cloudflare.env.logdb.writeDataPoint({
        'blobs': [
          event.context.requestMeta.remoteIP,
          path,
          event.context.requestMeta.version,
          event.context.requestMeta.debugMode
        ],
        'indexes': [Authentication.Username]
      });
    }
    
  } catch (error) {
    if (error instanceof Result) {
      throw error;
    }
    // Let other errors pass through
  }
});
