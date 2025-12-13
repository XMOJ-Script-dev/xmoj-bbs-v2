/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { IsAdminAsync, IsSilencedAsync } from "~/utils/auth";
import { AddBBSMention } from "~/utils/mentions";
import { sanitizeRichText } from "~/utils/sanitize";
import { IfUserExist } from "~/utils/xmoj";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "ReplyID": "number", "Content": "string" }));
  const Reply = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", ["post_id", "user_id"], { reply_id: Data.ReplyID }));
  if (Reply.toString() === "") {
    return new Result(false, "编辑失败，未找到此回复");
  }
  if (!(await IsAdminAsync(auth.username, auth.database)) && Reply[0]['user_id'] !== auth.username) {
    return new Result(false, "没有权限编辑此回复");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", { post_id: Reply[0]['post_id'] }))['TableSize'] === 0) {
    return new Result(false, "编辑失败，该回复所属的讨论不存在");
  }
  if (!(await IsAdminAsync(auth.username, auth.database)) && ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Reply[0]['post_id'] }))['TableSize'] === 1) {
    return new Result(false, "讨论已被锁定");
  }
  Data.Content = sanitizeRichText(Data.Content.trim());
  if (Data.Content === "") {
    return new Result(false, "内容不能为空");
  }
  if (await IsSilencedAsync(auth.username, auth.database)) {
    return new Result(false, "您已被禁言，无法编辑回复");
  }
  const MentionPeople: string[] = [];
  for (const Match of String(Data.Content).matchAll(/@([a-zA-Z0-9]+)/g)) {
    if (ThrowErrorIfFailed(await IfUserExist(Match[1], auth.database))['Exist']) {
      MentionPeople.push(Match[1]);
    }
  }
  const uniqueMentions = Array.from(new Set(MentionPeople));
  const isAdmin = await IsAdminAsync(auth.username, auth.database).catch(() => false);
  if (uniqueMentions.length > 3 && !isAdmin) {
    return new Result(false, "一次最多@3个人");
  }
  ThrowErrorIfFailed(await auth.database.Update("bbs_reply", {
    content: Data.Content,
    edit_time: new Date().getTime(),
    edit_person: auth.username
  }, { reply_id: Data.ReplyID }));
  
  for (const person of uniqueMentions) {
    await AddBBSMention(person, auth.username, Reply[0]['post_id'], Data.ReplyID, auth.database);
  }
  return new Result(true, "编辑回复成功");
});
