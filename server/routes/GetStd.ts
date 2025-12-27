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
import { GetProblemScore } from "~/utils/xmoj";
import { processCppString } from "~/utils/cppStringProcessor";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  ThrowErrorIfFailed(CheckParams(Data, { "ProblemID": "number" }));
  if (await GetProblemScore(Data.ProblemID, auth.username, auth.sessionID) < 50) {
    return new Result(false, "没有权限获取此标程");
  }
  const Std = ThrowErrorIfFailed(await auth.database.Select("std_answer", ["std_code"], { problem_id: Data.ProblemID }));
  if (Std.toString() === "") {
    return new Result(false, "此题还没有人上传标程");
  }
  const resp = new Result(true, "获得标程成功", { StdCode: Std[0]['std_code'] });
  return JSON.parse(processCppString(JSON.stringify(resp)));
});
