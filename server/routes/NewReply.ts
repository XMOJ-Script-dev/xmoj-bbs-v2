/*
 *     Copyright (C) 2023-2025  XMOJ-bbs contributors
 *     This file is part of XMOJ-bbs.
 *     XMOJ-bbs is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     XMOJ-bbs is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with XMOJ-bbs.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkPrams";
import { VerifyCaptcha } from "~/utils/captcha";
import { IsAdmin, IsSilenced } from "~/utils/auth";
import { AddBBSMention } from "~/utils/mentions";
import { IfUserExist } from "~/utils/xmoj";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, requestMeta, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, {
    "PostID": "number",
    "Content": "string",
    "CaptchaSecretKey": "string"
  }));
  
  ThrowErrorIfFailed(await VerifyCaptcha(
    Data.CaptchaSecretKey,
    cloudflare.env.CaptchaSecretKey,
    requestMeta.remoteIP
  ));
  
  const Post = ThrowErrorIfFailed(await auth.database.Select("bbs_post", ["title", "user_id", "board_id"], { post_id: Data.PostID }));
  if (Post.toString() == "") {
    return new Result(false, "该讨论不存在");
  }
  
  if (Post[0]["board_id"] == 5) {
    return new Result(false, "此讨论不允许回复");
  }
  
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", {
    post_id: Data.PostID
  }))["TableSize"] === 1 && !IsAdmin(auth.username)) {
    return new Result(false, "讨论已被锁定");
  }
  
  if (IsSilenced(auth.username)) {
    return new Result(false, "您已被禁言，无法回复讨论");
  }
  
  Data.Content = Data.Content.trim();
  if (Data.Content === "") {
    return new Result(false, "内容不能为空");
  }
  
  let MentionPeople = new Array<string>();
  for (const Match of String(Data.Content).matchAll(/@([a-zA-Z0-9]+)/g)) {
    if (ThrowErrorIfFailed(await IfUserExist(Match[1], auth.database))["Exist"]) {
      MentionPeople.push(Match[1]);
    }
  }
  MentionPeople = Array.from(new Set(MentionPeople));
  if (MentionPeople.length > 3 && !IsAdmin(auth.username)) {
    return new Result(false, "一次最多@3个人");
  }
  
  const ReplyID = ThrowErrorIfFailed(await auth.database.Insert("bbs_reply", {
    user_id: auth.username,
    post_id: Data.PostID,
    content: Data.Content,
    reply_time: new Date().getTime()
  }))["InsertID"];
  
  for (const person of MentionPeople) {
    await AddBBSMention(person, auth.username, Data.PostID, ReplyID, auth.database);
  }
  
  if (Post[0]["user_id"] !== auth.username) {
    await AddBBSMention(Post[0]["user_id"], auth.username, Data.PostID, ReplyID, auth.database);
  }
  
  return new Result(true, "创建回复成功", {
    ReplyID: ReplyID
  });
});
