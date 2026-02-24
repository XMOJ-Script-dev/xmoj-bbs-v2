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

import { Result, ThrowErrorIfFailed } from "./resultUtils";
import { Database } from "./database";
import { Output } from "./output";
// @ts-ignore
import CryptoJS from "crypto-js";
// Use named Cheerio export compatible with Node tests and browser builds
// Avoid importing cheerio at top-level to prevent test env issues.

// Time constants
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

const AdminUserList: Array<string> = [];
const DenyMessageList: Array<string> = [];
const SilencedUser: Array<string> = [];
const DenyBadgeEditList: Array<string> = [];

// Database-driven checks
export async function IsAdminAsync(Username: string, XMOJDatabase: Database): Promise<boolean> {
  try {
    const size = ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("bbs_admin", { user_id: Username }))['TableSize'];
    return size > 0;
  } catch {
    return false;
  }
}

export async function IsSilencedAsync(Username: string, XMOJDatabase: Database): Promise<boolean> {
  try {
    const size = ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("bbs_silenced", { user_id: Username }))['TableSize'];
    return size > 0;
  } catch {
    return false;
  }
}

export async function DenyMessageAsync(Username: string, XMOJDatabase: Database): Promise<boolean> {
  try {
    const size = ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("bbs_deny_message", { user_id: Username }))['TableSize'];
    return size > 0;
  } catch {
    return false;
  }
}

export async function DenyEditAsync(Username: string, XMOJDatabase: Database): Promise<boolean> {
  try {
    const size = ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("bbs_deny_badge_edit", { user_id: Username }))['TableSize'];
    return size > 0;
  } catch {
    return false;
}

export async function CheckToken(
  SessionID: string,
  Username: string,
  XMOJDatabase: Database,
  // Optional KV for distributed cache
  KV?: { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: any) => Promise<void> },
  // Optional request metadata for session binding
  requestMeta?: { ip?: string; userAgent?: string }
): Promise<Result> {
  const mask = (s: string): string => {
    if (!s) return "";
    if (s.length <= 8) return "***";
    return s.slice(0, 4) + "..." + s.slice(-4);
  };
  const HashedToken: string = CryptoJS.SHA3(SessionID).toString();
  const CurrentSessionData = ThrowErrorIfFailed(await XMOJDatabase.Select("phpsessid", ["user_id", "create_time"], {
    token: HashedToken
  }));
  if ((CurrentSessionData as any[]).toString() !== "") {
    if ((CurrentSessionData as any[])[0]["user_id"] === Username &&
      (CurrentSessionData as any[])[0]["create_time"] + SESSION_EXPIRY_MS > new Date().getTime()) {
      // Session valid - update last access time for session rotation
      try {
        await XMOJDatabase.Update("phpsessid", { create_time: new Date().getTime() }, { token: HashedToken });
      } catch (e) {
        // Ignore update errors, session is still valid
      }
      return new Result(true, "令牌匹配");
    } else {
      ThrowErrorIfFailed(await XMOJDatabase.Delete("phpsessid", { token: HashedToken }));
      Output.Log("Session " + mask(SessionID) + " expired");
    }
  }

  // Distributed KV cache preferred if available
  if (KV) {
    const kvCached = await KV.get(`sess:${SessionID}`);
    if (kvCached) {
      if (kvCached === Username) {
        const tableSizeResult = ThrowErrorIfFailed(
          await XMOJDatabase.GetTableSize("phpsessid", { token: HashedToken })
        ) as { TableSize: number };
        if (tableSizeResult.TableSize === 0) {
          try {
            await XMOJDatabase.Insert("phpsessid", { token: HashedToken, user_id: Username, create_time: new Date().getTime() });
          } catch (error) {
            // Ignore race condition errors; session will be valid from concurrent insert
          }
        }
        return new Result(true, "令牌匹配");
      } else {
        return new Result(false, "令牌不匹配");
      }
    }
  }
  // Short-term in-memory cache to reduce external calls
  // @ts-ignore
  const _MAX_CACHE_ENTRIES = 1000; // Reserved for future cache size limiting
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
  const globalCache: Map<string, { u: string; t: number }> = (globalThis as any).__tokenCache || ((globalThis as any).__tokenCache = new Map<string, { u: string, t: number }>());

  // Fix race condition: check cache once and store result
  const cached = globalCache.get(SessionID);
  const nowTs = new Date().getTime();
  const isExpired = cached && (nowTs - cached.t) >= CACHE_TTL_MS;

  if (isExpired) {
    // expired; remove to prevent growth
    globalCache.delete(SessionID);
  } else if (cached) {
    // Cache is valid, use it
    if (cached.u === Username) {
      Output.Log("Using cached session for user");
      const tableSizeResult = ThrowErrorIfFailed(
        await XMOJDatabase.GetTableSize("phpsessid", { token: HashedToken })
      ) as { TableSize: number };
      if (tableSizeResult.TableSize === 0) {
        try {
          await XMOJDatabase.Insert("phpsessid", { token: HashedToken, user_id: Username, create_time: new Date().getTime() });
        } catch (error) {
          // Ignore race condition errors; session will be valid from concurrent insert
        }
      }
      return new Result(true, "令牌匹配");
    } else {
      return new Result(false, "令牌不匹配");
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const SessionUsername: string = await fetch(new URL("https://www.xmoj.tech/template/bs3/profile.php"), {
    headers: {
      "Cookie": "PHPSESSID=" + SessionID,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "permissions-policy": "browsing-topics=()",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    method: "GET",
    signal: controller.signal
  })
    .then((Response) => {
      return Response.text();
    }).then(async (Response) => {
      // Prefer cheerio parsing in all environments; fallback to regex if unavailable
      try {
        const mod: any = await import('cheerio');
        const $ = mod.load(Response);
        let found = "";
        $('a[href*="user_id="]').each((_: any, el: any) => {
          if (found) return;
          const href = $(el).attr('href') || '';
          const m = href.match(/user_id=([a-zA-Z0-9_\-]+)/);
          if (m && m[1]) found = m[1];
        });
        if (found) return found;
      } catch {
      const m = Response.match(/user_id=([a-zA-Z0-9_\-]+)/);
      return m ? m[1] : "";
    }).catch((Error) => {
      Output.Error("Check token failed: " + Error + "\n" +
        "PHPSessionID: \"" + mask(SessionID) + "\"\n" +
        "Username    : \"" + Username + "\"\n");
      return "";
    }).finally(() => clearTimeout(timeout));
    
  if (SessionUsername === "") {
    Output.Debug("Check token failed: Session invalid\n" +
      "PHPSessionID: \"" + mask(SessionID) + "\"\n");
    return new Result(false, "令牌不合法");
  }
  if (SessionUsername !== Username) {
    Output.Debug("Check token failed: Session and username not match \n" +
      "PHPSessionID   : \"" + mask(SessionID) + "\"\n" +
      "SessionUsername: \"" + SessionUsername + "\"\n" +
      "Username       : \"" + Username + "\"\n");
    return new Result(false, "令牌不匹配");
  }

  // Handle race condition: check if token exists before inserting to avoid duplicate key errors
  const tableSizeResult = ThrowErrorIfFailed(
    await XMOJDatabase.GetTableSize("phpsessid", { token: HashedToken })
  ) as { TableSize: number };
  if (tableSizeResult.TableSize === 0) {
    try {
      await XMOJDatabase.Insert("phpsessid", {
        token: HashedToken,
        user_id: Username,
        create_time: new Date().getTime()
      });
    } catch (error) {
      // If duplicate key error (race condition), token already exists from concurrent request - this is fine
      // For other errors, log but continue since token verification already passed
      const errMsg = error instanceof Error ? error.message : String(error);
      if (!errMsg.includes('UNIQUE') && !errMsg.includes('duplicate')) {
        Output.Error("Token insert error (continuing): " + errMsg);
      }
    }
  }
  
  // Update caches after successful verification
  globalCache.set(SessionID, { u: Username, t: nowTs });
  if (KV) {
    try {
      await KV.put(`sess:${SessionID}`, Username, { expirationTtl: SESSION_EXPIRY_MS / 1000 });
    } catch (e) {
      // Ignore KV errors
    }
  }
  
  Output.Log("Record session: " + mask(SessionID) + " for " + Username);
  return new Result(true, "令牌匹配");
}

export function IsAdmin(Username: string): boolean {
  return AdminUserList.indexOf(Username) !== -1;
}

export function DenyMessage(Username: string): boolean {
  return DenyMessageList.indexOf(Username) !== -1;
}

export function IsSilenced(Username: string): boolean {
  return SilencedUser.indexOf(Username) !== -1;
}

export function DenyEdit(Username: string): boolean {
  return DenyBadgeEditList.indexOf(Username) !== -1;
}
