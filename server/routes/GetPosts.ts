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

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, {
    "ProblemID": "number",
    "Page": "number",
    "BoardID": "number",
    "Limit": "number"
  }));
  
  const PAGE_SIZE = Data.Limit && Data.Limit > 0 ? Data.Limit : 15;
  let ResponseData = {
    Posts: new Array<Object>,
    PageCount: Data.BoardID !== -1 ? (Data.ProblemID !== 0 ? Math.ceil(ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", {
      board_id: Data.BoardID,
      problem_id: Data.ProblemID
    }))["TableSize"] / PAGE_SIZE) : Math.ceil(ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", {
      board_id: Data.BoardID
    }))["TableSize"] / PAGE_SIZE)) : (Data.ProblemID !== 0 ? Math.ceil(ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post", {
      problem_id: Data.ProblemID
    }))["TableSize"] / PAGE_SIZE) : Math.ceil(ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_post"))["TableSize"] / PAGE_SIZE))
  };
  
  if (ResponseData.PageCount === 0) {
    return new Result(true, "获得讨论列表成功", ResponseData);
  }
  if (Data.Page < 1 || Data.Page > ResponseData.PageCount) {
    return new Result(false, "参数页数不在范围1~" + ResponseData.PageCount + "内");
  }
  
  const SearchCondition = {};
  if (Data.ProblemID !== 0) {
    SearchCondition["problem_id"] = Data.ProblemID;
  }
  if (Data.BoardID !== -1) {
    SearchCondition["board_id"] = Data.BoardID;
  }
  
  const Posts = ThrowErrorIfFailed(await auth.database.Select("bbs_post", [], SearchCondition, {
    Order: "post_id",
    OrderIncreasing: false,
    Limit: PAGE_SIZE,
    Offset: (Data.Page - 1) * PAGE_SIZE
  }));
  
  for (const Post of (Posts as any[])) {
    
    const ReplyCount: number = ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_reply", { post_id: Post["post_id"] }))["TableSize"];
    const LastReply = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", ["user_id", "reply_time"], { post_id: Post["post_id"] }, {
      Order: "reply_time",
      OrderIncreasing: false,
      Limit: 1
    }));
    
    if (ReplyCount === 0) {
      await auth.database.Delete("bbs_post", {
        post_id: Post["post_id"]
      });
      continue;
    }
    
    const LockData = {
      Locked: false,
      LockPerson: "",
      LockTime: 0
    };
    const Locked = ThrowErrorIfFailed(await auth.database.Select("bbs_lock", [], {
      post_id: Post["post_id"]
    }));
    if (Locked.toString() !== "") {
      LockData.Locked = true;
      LockData.LockPerson = Locked[0]["lock_person"];
      LockData.LockTime = Locked[0]["lock_time"];
    }
    
    ResponseData.Posts.push({
      PostID: Post["post_id"],
      UserID: Post["user_id"],
      ProblemID: Post["problem_id"],
      Title: Post["title"],
      PostTime: Post["post_time"],
      BoardID: Post["board_id"],
      BoardName: ThrowErrorIfFailed(await auth.database.Select("bbs_board", ["board_name"], {
        board_id: Post["board_id"]
      }))[0]["board_name"],
      ReplyCount: ReplyCount,
      LastReplyUserID: LastReply[0]["user_id"],
      LastReplyTime: LastReply[0]["reply_time"],
      Lock: LockData
    });
  }
  
  return new Result(true, "获得讨论列表成功", ResponseData);
});
