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

import { Database } from "~/utils/database";

// Time constants matching auth.ts
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SESSION_EXPIRY_DAYS = 7; // Must match SESSION_EXPIRY_DAYS in auth.ts
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const MESSAGE_RETENTION_DAYS = 5; // Keep read messages for 5 days

export default defineNitroPlugin((nitroApp: any) => {
  nitroApp.hooks.hook('cloudflare:scheduled', async (event: any) => {
    const { env, context } = event;
    let XMOJDatabase = new Database(env.DB);

    context.waitUntil(new Promise<void>(async (Resolve) => {
      await XMOJDatabase.Delete("short_message", {
        "send_time": {
          "Operator": "<=",
          "Value": new Date().getTime() - (MESSAGE_RETENTION_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
        },
        "is_read": {
          "Operator": "=",
          "Value": 1
        }
      });
      await XMOJDatabase.Delete("phpsessid", {
        "create_time": {
          "Operator": "<=",
          "Value": new Date().getTime() - SESSION_EXPIRY_MS
        }
      });
      Resolve();
    }));
  });
});
