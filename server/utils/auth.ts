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

// Time constants
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

const AdminUserList: Array<string> = ["chenlangning", "shanwenxiao", "zhuchenrui2"];
const DenyMessageList: Array<string> = ["std"];
const SilencedUser: Array<string> = ["zhaochenyi", "qianwenyu"];
const DenyBadgeEditList: Array<string> = [];

export async function CheckToken(
  SessionID: string,
  Username: string,
  XMOJDatabase: Database
): Promise<Result> {
  const HashedToken: string = CryptoJS.SHA3(SessionID).toString();
  const CurrentSessionData = ThrowErrorIfFailed(await XMOJDatabase.Select("phpsessid", ["user_id", "create_time"], {
    token: HashedToken
  }));
  
  if (CurrentSessionData.toString() !== "") {
    if (CurrentSessionData[0]["user_id"] === Username &&
      CurrentSessionData[0]["create_time"] + SESSION_EXPIRY_MS > new Date().getTime()) {
      return new Result(true, "令牌匹配");
    } else {
      ThrowErrorIfFailed(await XMOJDatabase.Delete("phpsessid", {
        token: HashedToken
      }));
      Output.Log("Session " + SessionID + " expired");
    }
  }

  // Short-term cache to reduce external calls
  // @ts-ignore
  const globalCache = (globalThis as any).__tokenCache || ((globalThis as any).__tokenCache = new Map<string, { u: string, t: number }>());
  const cached = globalCache.get(SessionID);
  if (cached && (new Date().getTime() - cached.t) < (5 * 60 * 1000)) {
    if (cached.u === Username) {
      Output.Log("Using cached session for user");
      if (ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("phpsessid", { token: HashedToken }))['TableSize'] == 0) {
        ThrowErrorIfFailed(await XMOJDatabase.Insert("phpsessid", { token: HashedToken, user_id: Username, create_time: new Date().getTime() }));
      }
      return new Result(true, "令牌匹配");
    } else {
      return new Result(false, "令牌不匹配");
    }
  }

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
    method: "GET"
  })
    .then((Response) => {
      return Response.text();
    }).then((Response) => {
      let SessionUsername = Response.substring(Response.indexOf("user_id=") + 8);
      SessionUsername = SessionUsername.substring(0, SessionUsername.indexOf("'"));
      globalCache.set(SessionID, { u: SessionUsername, t: new Date().getTime() });
      return SessionUsername;
    }).catch((Error) => {
      Output.Error("Check token failed: " + Error + "\n" +
        "PHPSessionID: \"" + SessionID + "\"\n" +
        "Username    : \"" + Username + "\"\n");
      return "";
    });
    
  if (SessionUsername == "") {
    Output.Debug("Check token failed: Session invalid\n" +
      "PHPSessionID: \"" + SessionID + "\"\n");
    return new Result(false, "令牌不合法");
  }
  if (SessionUsername != Username) {
    Output.Debug("Check token failed: Session and username not match \n" +
      "PHPSessionID   : \"" + SessionID + "\"\n" +
      "SessionUsername: \"" + SessionUsername + "\"\n" +
      "Username       : \"" + Username + "\"\n");
    return new Result(false, "令牌不匹配");
  }
  
  if (ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("phpsessid", {
    token: HashedToken
  }))["TableSize"] == 0) {
    ThrowErrorIfFailed(await XMOJDatabase.Insert("phpsessid", {
      token: HashedToken,
      user_id: Username,
      create_time: new Date().getTime()
    }));
  } else {
    Output.Log("token already exists, skipping insert");
  }
  Output.Log("Record session: " + SessionID + " for " + Username);
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
