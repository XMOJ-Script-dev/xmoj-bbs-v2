/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";
import { DenyMessageAsync, IsSilencedAsync, IsAdminAsync } from "~/utils/auth";
import { AddMailMention } from "~/utils/mentions";
import CryptoJS from "crypto-js";
import { IfUserExist } from "~/utils/xmoj";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "ToUser": "string", "Content": "string" }));
  if (await DenyMessageAsync(Data.ToUser, auth.database)) {
    return new Result(false, "该用户已关闭短消息接收");
  }
  // Validate user exists for all messages, not just specific content
  if (ThrowErrorIfFailed(await IfUserExist(Data.ToUser, auth.database))['Exist'] === false) {
    return new Result(false, "未找到用户");
  }
  if (Data.ToUser === auth.username) {
    return new Result(false, "无法给自己发送短消息");
  }
  if (Data.Content.length > 2000) {
    return new Result(false, "短消息过长");
  }
  if (!(await IsAdminAsync(Data.ToUser, auth.database)) && (await IsSilencedAsync(auth.username, auth.database))) {
    return new Result(false, "你已被禁言，无法向非管理员发送短消息");
  }
  const encryptedContent = "Begin xssmseetee v2 encrypted message" + CryptoJS.AES.encrypt(Data.Content, cloudflare.env.xssmseetee_v1_key + auth.username + Data.ToUser).toString();
  const MessageID = ThrowErrorIfFailed(await auth.database.Insert("short_message", {
    message_from: auth.username,
    message_to: Data.ToUser,
    content: encryptedContent,
    send_time: new Date().getTime()
  }))['InsertID'];
  await AddMailMention(auth.username, Data.ToUser, auth.database);
  return new Result(true, "发送短消息成功", { MessageID });
});
