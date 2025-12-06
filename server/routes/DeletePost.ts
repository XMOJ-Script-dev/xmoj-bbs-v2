/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { IsAdmin } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "PostID": "number" }));
  const Post = ThrowErrorIfFailed(await auth.database.Select("bbs_post", ["user_id"], { post_id: Data.PostID }));
  if (Post.toString() === "") {
    return new Result(false, "删除失败，该讨论不存在");
  }
  if (!IsAdmin(auth.username) && ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Data.PostID }))['TableSize'] === 1) {
    return new Result(false, "讨论已被锁定");
  }
  if (!IsAdmin(auth.username) && Post[0]['user_id'] !== auth.username) {
    return new Result(false, "没有权限删除此讨论");
  }
  const Replies = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", ["reply_id"], { post_id: Data.PostID }));
  for (const i in Replies) {
    await auth.database.Delete("bbs_reply", { reply_id: Replies[i]['reply_id'] });
  }
  await auth.database.Delete("bbs_post", { post_id: Data.PostID });
  return new Result(true, "删除讨论成功");
});
