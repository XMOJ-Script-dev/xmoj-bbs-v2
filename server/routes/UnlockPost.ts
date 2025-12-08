/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";
import { IsAdmin } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "PostID": "number" }));
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", { post_id: Data.PostID }))['TableSize'] === 0) {
    return new Result(false, "解锁失败，该讨论不存在");
  }
  if (!IsAdmin(auth.username)) {
    return new Result(false, "没有权限解锁此讨论");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Data.PostID }))['TableSize'] === 0) {
    return new Result(false, "讨论已经被解锁");
  }
  ThrowErrorIfFailed(await auth.database.Delete("bbs_lock", { post_id: Data.PostID }));
  return new Result(true, "讨论解锁成功");
});
