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

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const body = await readBody(event);
  const { Data } = body || {};

  const ResponseData: { MentionList: any[] } = { MentionList: [] };
  const Mentions: any[] = ThrowErrorIfFailed(
    await auth.database.Select(
      "short_message_mention",
      ["mention_id", "from_user_id", "mention_time"],
      { to_user_id: auth.username }
    )
  );

  for (const Mention of Mentions) {
    ResponseData.MentionList.push({
      MentionID: Mention["mention_id"],
      FromUserID: Mention["from_user_id"],
      MentionTime: Mention["mention_time"]
    });
  }

  return new Result(true, "获得短消息提及列表成功", ResponseData);
});
