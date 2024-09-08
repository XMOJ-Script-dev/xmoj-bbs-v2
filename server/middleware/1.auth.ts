import {readBody} from 'h3';
import {sqliteTable, text, numeric} from "drizzle-orm/sqlite-core";
import {eq} from "drizzle-orm";
import {phpsessid} from "~/utils/database.ts";
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  if (getRequestURL(event).pathname.startsWith('/GetNotice') || getRequestURL(event).pathname === '/') {  //Requests that don't need authentication
    return;
  }
  if (event._method !== "POST") {
    throw new Error("Actions that require authentication must use POST method");
  }
  const data = await readBody(event);
  ThrowErrorIfFailed(CheckParams(data, {
    "SessionID": "string",
    "Username": "string"
  }));
  const HashedToken: string = crypto.createHash('sha3-512').update(data.SessionID).digest('hex');
  const CurrentSessionData = ThrowErrorIfFailed(
    await drizzleDB
      .select({
        user_id: phpsessid.user_id,
        create_time: phpsessid.create_time
      })
      .from(phpsessid)
      .where(eq(phpsessid.token, HashedToken))
  );

})