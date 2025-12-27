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
import { CheckParams } from "~/utils/checkParams";
import { IsAdminAsync } from "~/utils/auth";
import { DeletePostWithReplies } from "~/utils/postUtils";
import { VerifyCaptcha } from "~/utils/captcha";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, requestMeta, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "ReplyID": "number", "CaptchaSecretKey": "string" }));
  
  ThrowErrorIfFailed(await VerifyCaptcha(
    Data.CaptchaSecretKey,
    cloudflare.env.CaptchaSecretKey,
    requestMeta.remoteIP,
    cloudflare.env.CAPTCHA_KV
  ));
  
  const Reply = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", ["user_id", "post_id"], { reply_id: Data.ReplyID }));
  if (!Array.isArray(Reply) || Reply.length === 0) {
    return new Result(false, "删除失败，该回复不存在");
  }
  const isAdmin = await IsAdminAsync(auth.username, auth.database);
  if (!isAdmin && ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_lock", { post_id: Reply[0]['post_id'] }))['TableSize'] === 1) {
    return new Result(false, "讨论已被锁定");
  }
  if (!isAdmin && Reply[0]['user_id'] !== auth.username) {
    return new Result(false, "没有权限删除此回复");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_reply", { post_id: Reply[0]['post_id'] }))['TableSize'] === 1) {
    return await DeletePostWithReplies(Reply[0]['post_id'], auth.database);
  }
  ThrowErrorIfFailed(await auth.database.Delete("bbs_reply", { reply_id: Data.ReplyID }));
  return new Result(true, "删除回复成功");
});
