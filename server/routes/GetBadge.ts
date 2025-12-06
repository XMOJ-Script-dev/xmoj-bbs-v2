/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";

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
