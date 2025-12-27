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
import { IsAdminAsync } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "PostID": "number" }));
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", { post_id: Data.PostID }))['TableSize'] === 0) {
    return new Result(false, "解锁失败，该讨论不存在");
  }
  if (!(await IsAdminAsync(auth.username, auth.database))) {
    return new Result(false, "没有权限解锁此讨论");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Data.PostID }))['TableSize'] === 0) {
    return new Result(false, "讨论已经被解锁");
  }
  ThrowErrorIfFailed(await auth.database.Delete("bbs_lock", { post_id: Data.PostID }));
  return new Result(true, "讨论解锁成功");
});
