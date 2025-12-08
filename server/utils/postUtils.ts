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

import { Result, ThrowErrorIfFailed } from "./resultUtils";
import { Database } from "./database";

/**
 * Shared utility to delete a post and all its replies
 */
export async function DeletePostWithReplies(
  postId: number,
  database: Database
): Promise<Result> {
  try {
    const Replies = ThrowErrorIfFailed(await database.Select("bbs_reply", ["reply_id"], { post_id: postId }));
    for (const reply of (Replies as any[])) {
      ThrowErrorIfFailed(await database.Delete("bbs_reply", { reply_id: reply['reply_id'] }));
    }
    ThrowErrorIfFailed(await database.Delete("bbs_post", { post_id: postId }));
    ThrowErrorIfFailed(await database.Delete("bbs_lock", { post_id: postId }));
    return new Result(true, "删除讨论成功");
  } catch (error) {
    return new Result(false, "删除讨论失败，请稍后重试");
  }
}
