/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { IsAdmin } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "ReplyID": "number" }));
  const Reply = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", ["user_id", "post_id"], { reply_id: Data.ReplyID }));
  if (Reply.toString() === "") {
    return new Result(false, "删除失败，该讨论不存在");
  }
  if (!IsAdmin(auth.username) && ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Reply[0]['post_id'] }))['TableSize'] === 1) {
    return new Result(false, "讨论已被锁定");
  }
  if (!IsAdmin(auth.username) && Reply[0]['user_id'] !== auth.username) {
    return new Result(false, "没有权限删除此回复");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_reply", { post_id: Reply[0]['post_id'] }))['TableSize'] === 1) {
    await (await import('./DeletePost')).default({ body: { Data: { PostID: Reply[0]['post_id'] } } } as any);
  }
  await auth.database.Delete("bbs_reply", { reply_id: Data.ReplyID });
  return new Result(true, "删除回复成功");
});
