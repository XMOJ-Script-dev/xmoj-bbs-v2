/*
 *     Copyright (C) 2023-2025  XMOJ-bbs contributors
 *     This file is part of XMOJ-bbs.
 *
 *     AGPL license header omitted for brevity in this snippet.
 */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
<<<<<<< Updated upstream
import { CheckParams } from "~/utils/checkParams";
import { IsAdmin } from "~/utils/auth";
=======
import { CheckParams } from "~/utils/checkPrams";
import { IsAdminAsync } from "~/utils/auth";
>>>>>>> Stashed changes

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "PostID": "number" }));
  
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", { post_id: Data.PostID }))['TableSize'] === 0) {
    return new Result(false, "该讨论不存在");
  }
  if (!(await IsAdminAsync(auth.username, auth.database))) {
    return new Result(false, "没有权限锁定此讨论");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Data.PostID }))['TableSize'] === 1) {
    return new Result(false, "讨论已经被锁定");
  }
  ThrowErrorIfFailed(await auth.database.Insert("bbs_lock", {
    post_id: Data.PostID,
    lock_person: auth.username,
    lock_time: new Date().getTime()
  }));
  return new Result(true, "讨论锁定成功");
});
