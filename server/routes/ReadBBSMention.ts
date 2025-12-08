/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "MentionID": "number" }));
  const MentionData = ThrowErrorIfFailed(await auth.database.Select("bbs_mention", ["to_user_id"], { bbs_mention_id: Data.MentionID }));
  if (MentionData.toString() === "") {
    return new Result(false, "未找到提及");
  }
  if (MentionData[0]['to_user_id'] !== auth.username) {
    return new Result(false, "没有权限阅读此提及");
  }
  ThrowErrorIfFailed(await auth.database.Delete("bbs_mention", { bbs_mention_id: Data.MentionID }));
  return new Result(true, "阅读讨论提及成功");
});
