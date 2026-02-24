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
import { VerifyCaptcha } from "~/utils/captcha";
import { IsAdminAsync, IsSilencedAsync } from "~/utils/auth";
import { sanitizeTitle } from "~/utils/htmlSanitizer";
import { sanitizeRichText } from "~/utils/sanitize";
import { Output } from "~/utils/output";

export default eventHandler(async (event: any) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, requestMeta, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, {
    "ProblemID": "number",
    "Title": { type: "string", maxLength: 256 },
    "Content": { type: "string", maxLength: 50000 },
    "CaptchaToken": "string",
    "BoardID": "number"
  }));
  
  ThrowErrorIfFailed(await VerifyCaptcha(
    Data.CaptchaToken,
    cloudflare.env.CaptchaSecretKey,
    requestMeta.remoteIP,
    cloudflare.env.CAPTCHA_KV
  ));
  
  if (Data.Title.trim() === "") {
    return new Result(false, "标题不能为空");
  }
  if (Data.Content.trim() === "") {
    return new Result(false, "内容不能为空");
  }
    if (!(await IsAdminAsync(auth.username, auth.database)) && (Data.BoardID == 0 || Data.BoardID == 5)) {
    return new Result(false, "没有权限发表公告");
  }
  if (await IsSilencedAsync(auth.username, auth.database)) {
    return new Result(false, "您已被禁言，无法创建讨论");
  }
  if (Data.BoardID !== 0) {
    const size = ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_board", { board_id: Data.BoardID })) as { TableSize: number };
    if (size.TableSize === 0) {
    return new Result(false, "该板块不存在");
    }
  }
  
  const PostID = (ThrowErrorIfFailed(await auth.database.Insert("bbs_post", {
    user_id: auth.username,
    problem_id: Data.ProblemID,
    title: sanitizeTitle(Data.Title, 256),
    post_time: new Date().getTime(),
    board_id: Data.BoardID
  })) as { InsertID: number }).InsertID;
  
  // Create the initial reply. If this fails, we cleanup the orphaned post
  let replyInsertResult;
  try {
    replyInsertResult = await auth.database.Insert("bbs_reply", {
      user_id: auth.username,
      post_id: PostID,
      content: sanitizeRichText(Data.Content),
      reply_time: new Date().getTime()
    });
    if (!replyInsertResult.Success) {
      // Cleanup orphaned post - wrap in try-catch to preserve original error
      try {
        await auth.database.Delete("bbs_post", { post_id: PostID });
      } catch (cleanupError) {
        // Log cleanup failure but don't mask the original error
        Output.Error(`Failed to cleanup orphaned post ${PostID}: ${cleanupError}`);
      }
      return new Result(false, "创建讨论失败，请稍后重试");
    }
  } catch (error) {
    // Cleanup orphaned post on error - wrap in try-catch to preserve original error
    try {
      await auth.database.Delete("bbs_post", { post_id: PostID });
    } catch (cleanupError) {
      // Log cleanup failure but don't mask the original error
      Output.Error(`Failed to cleanup orphaned post ${PostID}: ${cleanupError}`);
    }
    throw error;
  }
  
  const ReplyID = (ThrowErrorIfFailed(replyInsertResult) as { InsertID: number }).InsertID;
  
  return new Result(true, "创建讨论成功", {
    PostID: PostID,
    ReplyID: ReplyID
  });
});
