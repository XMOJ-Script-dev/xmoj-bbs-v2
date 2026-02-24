/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { decryptMessage } from "~/utils/messageEncryption";
import CryptoJS from "crypto-js";

export default eventHandler(async (event) => {
  const { auth, cloudflare } = event.context;
  const ResponseData: { MailList: any[] } = { MailList: [] };
  let OtherUsernameList: string[] = [];
  let Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", ["message_from"], { message_to: auth.username }, {}, true));
  for (const mail of (Mails as any[])) OtherUsernameList.push(mail['message_from']);
  Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", ["message_to"], { message_from: auth.username }, {}, true));
  for (const mail of (Mails as any[])) OtherUsernameList.push(mail['message_to']);
  OtherUsernameList = Array.from(new Set(OtherUsernameList));
  for (const other of OtherUsernameList) {
    const LastMessageFrom = ThrowErrorIfFailed(await auth.database.Select("short_message", ["content", "send_time", "message_from", "message_to"], { message_from: other, message_to: auth.username }, { Order: "send_time", OrderIncreasing: false, Limit: 1 }));
    const LastMessageTo = ThrowErrorIfFailed(await auth.database.Select("short_message", ["content", "send_time", "message_from", "message_to"], { message_from: auth.username, message_to: other }, { Order: "send_time", OrderIncreasing: false, Limit: 1 }));
    let LastMessage: any;
    if (LastMessageFrom.toString() === "") LastMessage = LastMessageTo; else if (LastMessageTo.toString() === "") LastMessage = LastMessageFrom; else LastMessage = LastMessageFrom[0]['send_time'] > LastMessageTo[0]['send_time'] ? LastMessageFrom : LastMessageTo;
    
    try {
      if (LastMessage[0]['content'].startsWith("Begin xssmseetee v3 encrypted message")) {
        // Modern v3 encryption using Web Crypto API
        LastMessage[0]['content'] = await decryptMessage(LastMessage[0]['content'], cloudflare.env.xssmseetee_v1_key, LastMessage[0]['message_from'], LastMessage[0]['message_to']);
      } else if (LastMessage[0]['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
        // Legacy v2 decryption (deprecated - should migrate to v3)
        const bytes = CryptoJS.AES.decrypt(LastMessage[0]['content'].substring(37), cloudflare.env.xssmseetee_v1_key + LastMessage[0]['message_from'] + LastMessage[0]['message_to']);
        LastMessage[0]['content'] = bytes.toString(CryptoJS.enc.Utf8);
      } else if (LastMessage[0]['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
        // Legacy v1 decryption (DEPRECATED - insecure shared key)
        const bytes = CryptoJS.AES.decrypt(LastMessage[0]['content'].substring(37), cloudflare.env.xssmseetee_v1_key);
        LastMessage[0]['content'] = bytes.toString(CryptoJS.enc.Utf8);
      }
      // If no encryption header, content is plaintext - use as-is
    } catch (error) {
      LastMessage[0]['content'] = "解密失败: " + (error as any).message;
    }
    const UnreadCount = ThrowErrorIfFailed(await auth.database.GetTableSize("short_message", { message_from: other, message_to: auth.username, is_read: 0 }));
    ResponseData.MailList.push({ OtherUser: other, LastMessage: LastMessage[0]['content'], SendTime: LastMessage[0]['send_time'], UnreadCount: UnreadCount['TableSize'] });
  }
  ResponseData.MailList.sort((a: any, b: any) => a['SendTime'] < b['SendTime'] ? 1 : -1);
  return new Result(true, "获得短消息列表成功", ResponseData);
});
