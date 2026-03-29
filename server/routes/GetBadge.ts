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
  ThrowErrorIfFailed(CheckParams(Data, { "UserID": "string" }));
  const BadgeData = ThrowErrorIfFailed(await auth.database.Select("badge", ["background_color", "color", "content"], { user_id: Data.UserID }));
  if (BadgeData.toString() == "") {
    return new Result(false, "获取标签失败，该标签在数据库中不存在");
  }
  return new Result(true, "获得标签成功", {
    Content: BadgeData[0]['content'],
    BackgroundColor: Data.UserID === "zhouyiqing" ? "#000000" : BadgeData[0]['background_color'],
    Color: Data.UserID === "zhouyiqing" ? "#ffffff" : BadgeData[0]['color']
  });
});
