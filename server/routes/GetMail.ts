/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";
import CryptoJS from "crypto-js";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "OtherUser": "string" }));
  const ResponseData = { Mail: new Array<Object>() };
  let Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", [], { message_from: Data.OtherUser, message_to: auth.username }, { Order: "send_time", OrderIncreasing: false }));
  for (const Mail of (Mails as any[])) {
    try {
      if (Mail['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key + Mail['message_from'] + Mail['message_to']).toString(CryptoJS.enc.Utf8);
      } else if (Mail['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key).toString(CryptoJS.enc.Utf8);
      } else {
        const preContent = Mail['content'];
        Mail['content'] = "无法解密消息, 原始数据: " + preContent;
      }
    } catch (error) {
      Mail['content'] = "解密失败: " + (error as any).message;
    }
    ResponseData.Mail.push({
      MessageID: Mail['message_id'],
      FromUser: Mail['message_from'],
      ToUser: Mail['message_to'],
      Content: Mail['content'],
      SendTime: Mail['send_time'],
      IsRead: Mail['is_read']
    });
  }
  Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", [], { message_from: auth.username, message_to: Data.OtherUser }, { Order: "send_time", OrderIncreasing: false }));
  for (const Mail of (Mails as any[])) {
    try {
      if (Mail['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key + Mail['message_from'] + Mail['message_to']).toString(CryptoJS.enc.Utf8);
      } else if (Mail['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key).toString(CryptoJS.enc.Utf8);
      } else {
        const preContent = Mail['content'];
        Mail['content'] = "无法解密消息, 原始数据: " + preContent;
      }
    } catch (error) {
      Mail['content'] = "解密失败: " + (error as any).message;
    }
    ResponseData.Mail.push({
      MessageID: Mail['message_id'],
      FromUser: Mail['message_from'],
      ToUser: Mail['message_to'],
      Content: Mail['content'],
      SendTime: Mail['send_time'],
      IsRead: Mail['is_read']
    });
  }
  ResponseData.Mail.sort((a, b) => a['SendTime'] < b['SendTime'] ? 1 : -1);
  await auth.database.Update("short_message", { is_read: 1 }, { message_from: Data.OtherUser, message_to: auth.username });
  return new Result(true, "获得短消息成功", ResponseData);
});
