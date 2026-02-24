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
import { Output } from "~/utils/output";

export default defineEventHandler(async (event: any) => {
  const path = (event && (event as any).path) ? (event as any).path : "";
  
  // Skip authentication for public endpoints with proper normalization
  const publicPaths = new Set(["/", "/getnotice", "/getaddonscript", "/getimage"]);
  // Normalize: decode URI components, remove query strings, convert to lowercase, remove trailing slashes
  let normalizedPath = path;
  try {
    // Remove query string first
    const pathWithoutQuery = normalizedPath.split('?')[0].split('#')[0];
    // Decode URI to prevent %2F and other encoded bypasses
    normalizedPath = decodeURIComponent(pathWithoutQuery);
    // Convert to lowercase for case-insensitive comparison
    normalizedPath = normalizedPath.toLowerCase();
    // Remove trailing slashes
    normalizedPath = normalizedPath.replace(/\/+$/, '') || '/';
  } catch (e) {
    // If decoding fails, treat as non-public path (safer default)
    normalizedPath = path;
  }
  if (publicPaths.has(normalizedPath)) {
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
    
    // Validate SessionID format to prevent CRLF injection
    if (!/^[a-zA-Z0-9]{1,128}$/.test(Authentication.SessionID)) {
      throw new Result(false, "SessionID格式不正确");
    }
    
    // Validate Username format
    if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(Authentication.Username)) {
      throw new Result(false, "Username格式不正确");
    }
    
    const { cloudflare } = event.context;
    const XMOJDatabase = new Database(cloudflare.env.DB);
    
    // Collect request metadata for session binding
    let remoteIP = "";
    let userAgent = "";
    let node: any = null;
    if (event && typeof event === "object" && (event as any).node) {
      node = (event as any).node;
    }
    if (node && node.req && node.req.headers) {
      const headers = node.req.headers;
      remoteIP = typeof headers["cf-connecting-ip"] === "string" ? headers["cf-connecting-ip"] : "";
      userAgent = typeof headers["user-agent"] === "string" ? headers["user-agent"] : "";
    }
    
    // Check token - fail immediately if invalid
    ThrowErrorIfFailed(await CheckToken(
      Authentication.SessionID,
      Authentication.Username,
      XMOJDatabase,
      // Pass KV if available for distributed cache
      (cloudflare.env as any).SESSION_KV,
      // Pass request metadata for session binding
      { ip: remoteIP, userAgent }
    ));
    
    // Store authenticated user info in context
    event.context.auth = {
      username: Authentication.Username,
      sessionID: Authentication.SessionID,
      database: XMOJDatabase
    };
    
    // Store request metadata with explicit guards
    event.context.requestMeta = {
      version: Version || "unknown",
      debugMode: DebugMode || false,
      remoteIP,
      userAgent
    };
    
    // Log to analytics if available
    try {
      if (cloudflare.env.logdb && typeof cloudflare.env.logdb.writeDataPoint === "function") {
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
    } catch (e) {
      // Ignore analytics logging errors
    }
    
  } catch (error) {
    if (error instanceof Result) {
      throw error;
    }
    // Log and throw non-Result errors to prevent authentication bypass
    Output.Error("Unexpected error in auth middleware: " + (error instanceof Error ? error.message : String(error)));
    throw new Result(false, "认证过程发生错误");
  }
});
