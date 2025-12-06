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
    "PostID": "number",
    "Page": "number"
  }));
  
  const ResponseData = {
    UserID: "",
    ProblemID: 0,
    Title: "",
    BoardID: 0,
    BoardName: "",
    PostTime: 0,
    Reply: new Array<Object>(),
    PageCount: 0,
    Lock: {
      Locked: false,
      LockPerson: "",
      LockTime: 0
    }
  };
  
  const Post = ThrowErrorIfFailed(await auth.database.Select("bbs_post", [], {
    post_id: Data.PostID
  }));
  if (Post.toString() == "") {
    return new Result(false, "该讨论不存在");
  }
  
  ResponseData.PageCount = Math.ceil(ThrowErrorIfFailed(await auth.database.GetTableSize("bbs_reply", { post_id: Data.PostID }))["TableSize"] / 15);
  if (ResponseData.PageCount === 0) {
    return new Result(true, "获得讨论成功", ResponseData);
  }
  if (Data.Page < 1 || Data.Page > ResponseData.PageCount) {
    return new Result(false, "参数页数不在范围1~" + ResponseData.PageCount + "内");
  }
  
  ResponseData.UserID = Post[0]["user_id"];
  ResponseData.ProblemID = Post[0]["problem_id"];
  ResponseData.Title = Post[0]["title"];
  ResponseData.PostTime = Post[0]["post_time"];
  ResponseData.BoardID = Post[0]["board_id"];
  ResponseData.BoardName = ThrowErrorIfFailed(await auth.database.Select("bbs_board", ["board_name"], { board_id: Post[0]["board_id"] }))[0]["board_name"];
  
  const Locked = ThrowErrorIfFailed(await auth.database.Select("bbs_lock", [], {
    post_id: Data.PostID
  }));
  if (Locked.toString() !== "") {
    ResponseData.Lock.Locked = true;
    ResponseData.Lock.LockPerson = Locked[0]["lock_person"];
    ResponseData.Lock.LockTime = Locked[0]["lock_time"];
  }
  
  const Reply = ThrowErrorIfFailed(await auth.database.Select("bbs_reply", [], { post_id: Data.PostID }, {
    Order: "reply_time",
    OrderIncreasing: true,
    Limit: 15,
    Offset: (Data.Page - 1) * 15
  }));
  
  for (const i in Reply) {
    let ReplyItem = Reply[i];
    let processedContent: string = ReplyItem["content"];
    processedContent = processedContent.replace(/xmoj-bbs\.tech/g, "xmoj-bbs.me");
    ResponseData.Reply.push({
      ReplyID: ReplyItem["reply_id"],
      UserID: ReplyItem["user_id"],
      Content: processedContent,
      ReplyTime: ReplyItem["reply_time"],
      EditTime: ReplyItem["edit_time"],
      EditPerson: ReplyItem["edit_person"]
    });
  }
  
  return new Result(true, "获得讨论成功", ResponseData);
});
