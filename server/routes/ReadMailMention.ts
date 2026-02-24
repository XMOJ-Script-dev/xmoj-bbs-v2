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
import { CheckParams } from "~/utils/checkParams";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;

  ThrowErrorIfFailed(CheckParams(Data, { "MentionID": "number" }));
  const MentionData = ThrowErrorIfFailed(
    await auth.database.Select(
      "short_message_mention",
      ["to_user_id"],
      { mention_id: Data.MentionID }
    )
  );

  if (MentionData.toString() === "") {
    return new Result(false, "未找到提及");
  }

  if (MentionData[0]["to_user_id"] !== auth.username) {
    return new Result(false, "没有权限阅读此提及");
  }

  ThrowErrorIfFailed(
    await auth.database.Delete("short_message_mention", {
      mention_id: Data.MentionID
    })
  );

  return new Result(true, "阅读短消息提及成功");
});
