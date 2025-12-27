/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";
import { sanitizeRichText } from "~/utils/sanitize";
import { IfUserExist } from "~/utils/xmoj";
import { decryptMessage } from "~/utils/messageEncryption";
import CryptoJS from "crypto-js";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "OtherUser": "string" }));
  
  // Validate that OtherUser exists BEFORE querying messages to prevent user enumeration
  const userExists = ThrowErrorIfFailed(await IfUserExist(Data.OtherUser, auth.database));
  if (!userExists['Exist']) {
    return new Result(false, "未找到用户");
  }
  
  // Add pagination support
  const limit = Data.Limit && typeof Data.Limit === 'number' && Data.Limit > 0 && Data.Limit <= 100 ? Data.Limit : 50;
  const offset = Data.Offset && typeof Data.Offset === 'number' && Data.Offset >= 0 ? Data.Offset : 0;
  
  const ResponseData: { Mail: any[], Total: number } = { Mail: [], Total: 0 };
  
  // Get total count for pagination
  const totalFrom = ThrowErrorIfFailed(await auth.database.GetTableSize("short_message", { message_from: Data.OtherUser, message_to: auth.username }))['TableSize'];
  const totalTo = ThrowErrorIfFailed(await auth.database.GetTableSize("short_message", { message_from: auth.username, message_to: Data.OtherUser }))['TableSize'];
  ResponseData.Total = totalFrom + totalTo;
  
  let Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", [], { message_from: Data.OtherUser, message_to: auth.username }, { Order: "send_time", OrderIncreasing: false, Limit: limit, Offset: offset }));
  for (const Mail of (Mails as any[])) {
    try {
      if (Mail['content'].startsWith("Begin xssmseetee v3 encrypted message")) {
        // Use new Web Crypto API decryption
        Mail['content'] = await decryptMessage(Mail['content'], cloudflare.env.xssmseetee_v1_key, Mail['message_from'], Mail['message_to']);
        // Sanitize decrypted content to prevent stored XSS
        Mail['content'] = sanitizeRichText(Mail['content']);
      } else if (Mail['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
        // Legacy v2 decryption (deprecated - should migrate to v3)
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key + Mail['message_from'] + Mail['message_to']).toString(CryptoJS.enc.Utf8);
        // Sanitize decrypted content to prevent stored XSS
        Mail['content'] = sanitizeRichText(Mail['content']);
      } else if (Mail['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
        // Legacy v1 decryption (DEPRECATED - insecure shared key)
        Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key).toString(CryptoJS.enc.Utf8);
        // Sanitize decrypted content to prevent stored XSS
        Mail['content'] = sanitizeRichText(Mail['content']);
      } else {
        const preContent = Mail['content'];
        Mail['content'] = "无法解密消息, 原始数据: " + sanitizeRichText(preContent);
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
  // Fetch sent messages with remaining limit
  const remainingLimit = Math.max(0, limit - ResponseData.Mail.length);
  if (remainingLimit > 0) {
    // Calculate offset for sent messages: only apply offset if we've gone past all received messages
    const sentOffset = offset > totalFrom ? offset - totalFrom : 0;
    Mails = ThrowErrorIfFailed(await auth.database.Select("short_message", [], { message_from: auth.username, message_to: Data.OtherUser }, { Order: "send_time", OrderIncreasing: false, Limit: remainingLimit, Offset: sentOffset }));
    for (const Mail of (Mails as any[])) {
      try {
        if (Mail['content'].startsWith("Begin xssmseetee v3 encrypted message")) {
          // Use new Web Crypto API decryption
          Mail['content'] = await decryptMessage(Mail['content'], cloudflare.env.xssmseetee_v1_key, Mail['message_from'], Mail['message_to']);
          // Sanitize decrypted content to prevent stored XSS
          Mail['content'] = sanitizeRichText(Mail['content']);
        } else if (Mail['content'].startsWith("Begin xssmseetee v2 encrypted message")) {
          // Legacy v2 decryption (deprecated - should migrate to v3)
          Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key + Mail['message_from'] + Mail['message_to']).toString(CryptoJS.enc.Utf8);
          // Sanitize decrypted content to prevent stored XSS
          Mail['content'] = sanitizeRichText(Mail['content']);
        } else if (Mail['content'].startsWith("Begin xssmseetee v1 encrypted message")) {
          // Legacy v1 decryption (DEPRECATED - insecure shared key)
          Mail['content'] = CryptoJS.AES.decrypt(Mail['content'].substring(37), cloudflare.env.xssmseetee_v1_key).toString(CryptoJS.enc.Utf8);
          // Sanitize decrypted content to prevent stored XSS
          Mail['content'] = sanitizeRichText(Mail['content']);
        } else {
          const preContent = Mail['content'];
          Mail['content'] = "无法解密消息, 原始数据: " + sanitizeRichText(preContent);
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
  }
  ResponseData.Mail.sort((a: any, b: any) => a['SendTime'] < b['SendTime'] ? 1 : -1);
  await auth.database.Update("short_message", { is_read: 1 }, { message_from: Data.OtherUser, message_to: auth.username });
  return new Result(true, "获得短消息成功", ResponseData);
});
