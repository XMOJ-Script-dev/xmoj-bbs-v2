/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { IsAdmin, DenyEdit } from "~/utils/auth";
import { sanitizeTitle } from "~/utils/htmlSanitizer";

export default eventHandler(async (event: any) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  ThrowErrorIfFailed(CheckParams(Data, { "UserID": "string", "BackgroundColor": "string", "Color": "string", "Content": "string" }));
  if (!IsAdmin(auth.username) && Data.UserID !== auth.username) {
    return new Result(false, "没有权限编辑此标签");
  }
  const size = ThrowErrorIfFailed(await auth.database.GetTableSize("badge", { user_id: Data.UserID })) as { TableSize: number };
  if (size.TableSize === 0) {
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
  // Strict character whitelist: letters, numbers, basic punctuation, CJK, curated emoji
  // Emoji ranges include common pictographs and symbols; exclude zero-width joiners and variation selectors
  const allowedPattern = /^[A-Za-z0-9\u4E00-\u9FFF\u3400-\u4DBF .,_\-!?:;()\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*$/u;
  if (!allowedPattern.test(Data.Content)) {
    return new Result(false, "内容包含不允许的字符，导致渲染问题");
  }
  if (Data.Content.trim() === "") {
    return new Result(false, "内容不能仅包含空格");
  }
  // Prevent control characters (U+0000 to U+001F, U+007F to U+009F)
  // Disallow control chars, zero-width characters, and variation selectors
  const controlCharPattern = /[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFE0E-\uFE0F]/u;
  if (controlCharPattern.test(Data.Content)) {
    return new Result(false, "内容包含不允许的控制字符");
  }
  // Strip any HTML and enforce byte limit on final content
  const sanitizedContent = sanitizeTitle(Data.Content, 64);
  const check = await cloudflare.env.AI.run("@cf/huggingface/distilbert-sst-2-int8", { text: sanitizedContent });
    if (check[check[0]["label"] == "NEGATIVE" ? 0 : 1]["score"] > 0.90) {
    return new Result(false, "您设置的标签内容含有负面词汇，请修改后重试");
  }
  ThrowErrorIfFailed(await auth.database.Update("badge", { background_color: Data.BackgroundColor, color: Data.Color, content: sanitizedContent }, { user_id: Data.UserID }));
  return new Result(true, "编辑标签成功");
});
