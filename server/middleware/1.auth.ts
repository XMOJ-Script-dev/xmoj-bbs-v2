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

import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { Database } from "~/utils/database";
import { CheckToken } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const path = event.path;
  
  // Skip authentication for public endpoints
  const publicEndpoints = ["/GetNotice", "/GetAddOnScript", "/GetImage", "/"];
  if (publicEndpoints.some(endpoint => path.includes(endpoint)) || path === "/") {
    return;
  }
  
  // Only process POST requests with JSON body
  if (event.method !== "POST") {
    return;
  }
  
  try {
    const body = await readBody(event);
    
    // Check if body has required authentication fields
    if (!body || !body.Authentication || !body.Data) {
      return;
    }
    
    const { Authentication } = body;
    
    // Validate Authentication object
    if (!Authentication.SessionID || !Authentication.Username) {
      throw new Result(false, "认证信息不完整");
    }
    
    const { cloudflare } = event.context;
    const XMOJDatabase = new Database(cloudflare.env.DB);
    
    // Check token multiple times if needed
    let TokenFailedCount = 0;
    while (TokenFailedCount < 2) {
      const tokenResult = await CheckToken(
        Authentication.SessionID,
        Authentication.Username,
        XMOJDatabase
      );
      
      if (tokenResult.Data["Success"]) {
        break;
      }
      TokenFailedCount++;
    }
    
    // Final token check
    if (TokenFailedCount >= 2) {
      ThrowErrorIfFailed(await CheckToken(
        Authentication.SessionID,
        Authentication.Username,
        XMOJDatabase
      ));
    }
    
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
      remoteIP: event.node.req.headers["cf-connecting-ip"] || ""
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
