/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { IsAdmin, DenyEdit } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  ThrowErrorIfFailed(CheckParams(Data, { "UserID": "string", "BackgroundColor": "string", "Color": "string", "Content": "string" }));
  if (!IsAdmin(auth.username) && Data.UserID !== auth.username) {
    return new Result(false, "没有权限编辑此标签");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("badge", { user_id: Data.UserID }))['TableSize'] === 0) {
    return new Result(false, "编辑失败，该标签在数据库中不存在");
  }
  if (DenyEdit(auth.username)) {
    return new Result(false, "你被禁止修改标签");
  }
  if (Data.Content.length > 20) {
    return new Result(false, "标签内容过长");
  }
  if (Data.Content.includes("管理员") || Data.Content.toLowerCase().includes("manager") || Data.Content.toLowerCase().includes("admin")) {
    return new Result(false, "请不要试图冒充管理员");
  }
  const allowedPattern = /^[\u0000-\u007F\u4E00-\u9FFF\u3400-\u4DBF\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF\uD83C-\uDBFF\uDC00-\uDFFF]*$/;
  if (!allowedPattern.test(Data.Content)) {
    return new Result(false, "内容包含不允许的字符，导致渲染问题");
  }
  if (Data.Content.trim() === "") {
    return new Result(false, "内容不能仅包含空格");
  }
  const check = await cloudflare.env.AI.run("@cf/huggingface/distilbert-sst-2-int8", { text: Data.Content });
    if (check[check[0]["label"] == "NEGATIVE" ? 0 : 1]["score"] > 0.90) {
    return new Result(false, "您设置的标签内容含有负面词汇，请修改后重试");
  }
  ThrowErrorIfFailed(await auth.database.Update("badge", { background_color: Data.BackgroundColor, color: Data.Color, content: Data.Content }, { user_id: Data.UserID }));
  return new Result(true, "编辑标签成功");
});
