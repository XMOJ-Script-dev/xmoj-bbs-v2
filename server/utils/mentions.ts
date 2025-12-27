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

import { ThrowErrorIfFailed } from "~/utils/resultUtils";
import { Database } from "~/utils/database";

export async function AddBBSMention(
  ToUserID: string,
  FromUserID: string,
  PostID: number,
  ReplyID: number,
  XMOJDatabase: Database
): Promise<void> {
  if (ToUserID === FromUserID) {
    return;
  }
  if (ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("bbs_mention", {
    to_user_id: ToUserID,
    post_id: PostID
  }))["TableSize"] === 0) {
    ThrowErrorIfFailed(await XMOJDatabase.Insert("bbs_mention", {
      to_user_id: ToUserID,
      post_id: PostID,
      bbs_mention_time: new Date().getTime(),
      reply_id: ReplyID
    }));
  } else {
    // Update existing mention - remove reply_id from WHERE to handle multiple mentions per post
    ThrowErrorIfFailed(await XMOJDatabase.Update("bbs_mention", {
      bbs_mention_time: new Date().getTime(),
      reply_id: ReplyID
    }, {
      to_user_id: ToUserID,
      post_id: PostID
    }));
  }
}

export async function AddMailMention(
  FromUserID: string,
  ToUserID: string,
  XMOJDatabase: Database
): Promise<void> {
  if (ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("short_message_mention", {
    from_user_id: FromUserID,
    to_user_id: ToUserID
  }))["TableSize"] === 0) {
    ThrowErrorIfFailed(await XMOJDatabase.Insert("short_message_mention", {
      from_user_id: FromUserID,
      to_user_id: ToUserID,
      mail_mention_time: new Date().getTime()
    }));
  } else {
    ThrowErrorIfFailed(await XMOJDatabase.Update("short_message_mention", {
      mail_mention_time: new Date().getTime()
    }, {
      from_user_id: FromUserID,
      to_user_id: ToUserID
    }));
  }
}
