/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import CryptoJS from "crypto-js";

export default eventHandler(async (event) => {
  const { auth, cloudflare } = event.context;
  const ResponseData = { MailList: new Array<Object>() };
  let OtherUsernameList: string[] = [];
  let Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", ["message_from"], { message_to: auth.username }, {}, true));
  for (const i in Mails) OtherUsernameList.push(Mails[i]['message_from']);
  Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", ["message_to"], { message_from: auth.username }, {}, true));
  for (const mail of Mails) OtherUsernameList.push(mail['message_to']);
  OtherUsernameList = Array.from(new Set(OtherUsernameList));
  for (const other of OtherUsernameList) {
    const LastMessageFrom = ThrowErrorIfFailed(await auth.database.Select("short_message", ["content", "send_time", "message_from", "message_to"], { message_from: other, message_to: auth.username }, { Order: "send_time", OrderIncreasing: false, Limit: 1 }));
    const LastMessageTo = ThrowErrorIfFailed(await auth.database.Select("short_message", ["content", "send_time", "message_from", "message_to"], { message_from: auth.username, message_to: other }, { Order: "send_time", OrderIncreasing: false, Limit: 1 }));
    let LastMessage: any;
    if (LastMessageFrom.toString() === "") LastMessage = LastMessageTo; else if (LastMessageTo.toString() === "") LastMessage = LastMessageFrom; else LastMessage = LastMessageFrom[0]['send_time'] > LastMessageTo[0]['send_time'] ? LastMessageFrom : LastMessageTo;
    if (LastMessage[0]['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
      try {
        const bytes = CryptoJS.AES.decrypt(LastMessage[0]['content'].substring(37), cloudflare.env.xssmseetee_v1_key + LastMessage[0]['message_from'] + LastMessage[0]['message_to']);
        LastMessage[0]['content'] = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        LastMessage[0]['content'] = "解密失败: " + (error as any).message;
      }
    } else if (LastMessage[0]['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
      try {
        const bytes = CryptoJS.AES.decrypt(LastMessage[0]['content'].substring(37), cloudflare.env.xssmseetee_v1_key);
        LastMessage[0]['content'] = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        LastMessage[0]['content'] = "解密失败: " + (error as any).message;
      }
    } else {
      const preContent = LastMessage[0]['content'];
      LastMessage[0]['content'] = "无法解密消息, 原始数据: " + preContent;
    }
    const UnreadCount = ThrowErrorIfFailed(await auth.database.GetTableSize("short_message", { message_from: OtherUsernameList[i], message_to: auth.username, is_read: 0 }));
    ResponseData.MailList.push({ OtherUser: OtherUsernameList[i], LastsMessage: LastMessage[0]['content'], SendTime: LastMessage[0]['send_time'], UnreadCount: UnreadCount['TableSize'] });
  }
  ResponseData.MailList.sort((a, b) => a['SendTime'] < b['SendTime'] ? 1 : -1);
  return new Result(true, "获得短消息列表成功", ResponseData);
});
