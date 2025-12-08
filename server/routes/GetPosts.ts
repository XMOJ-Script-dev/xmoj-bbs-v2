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
  
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const PAGE_SIZE = clamp(Number.isFinite(Data.Limit) ? Data.Limit : 15, 1, 100);
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
  
  // Batch query to avoid N+1: join board and use subqueries for reply stats and lock info
  const offset = (Data.Page - 1) * PAGE_SIZE;
  const whereClauses: string[] = [];
  const bindParams: any[] = [];
  if (SearchCondition["problem_id"]) { whereClauses.push("p.problem_id = ?"); bindParams.push(SearchCondition["problem_id"]); }
  if (SearchCondition["board_id"]) { whereClauses.push("p.board_id = ?"); bindParams.push(SearchCondition["board_id"]); }
  const whereSql = whereClauses.length ? ("WHERE " + whereClauses.join(" AND ")) : "";
  const sql = `
    SELECT p.post_id, p.user_id, p.problem_id, p.title, p.post_time, p.board_id,
           b.board_name,
           (SELECT COUNT(*) FROM bbs_reply r WHERE r.post_id = p.post_id) AS reply_count,
           (SELECT r2.user_id FROM bbs_reply r2 WHERE r2.post_id = p.post_id ORDER BY r2.reply_time DESC LIMIT 1) AS last_reply_user_id,
           (SELECT r3.reply_time FROM bbs_reply r3 WHERE r3.post_id = p.post_id ORDER BY r3.reply_time DESC LIMIT 1) AS last_reply_time,
           (SELECT lock_person FROM bbs_lock l WHERE l.post_id = p.post_id LIMIT 1) AS lock_person,
           (SELECT lock_time FROM bbs_lock l WHERE l.post_id = p.post_id LIMIT 1) AS lock_time
    FROM bbs_post p
    LEFT JOIN bbs_board b ON b.board_id = p.board_id
    ${whereSql}
    ORDER BY p.post_id DESC
    LIMIT ? OFFSET ?
  `;
  const rows = await (auth.database as any).RawDatabase.prepare(sql).bind(...bindParams, PAGE_SIZE, offset).all();
  for (const row of rows.results) {
    // Do not mutate data during read; cleanup should be handled by scheduled tasks
    const LockData = {
      Locked: !!row.lock_person,
      LockPerson: row.lock_person || "",
      LockTime: row.lock_time || 0
    };
    ResponseData.Posts.push({
      PostID: row.post_id,
      UserID: row.user_id,
      ProblemID: row.problem_id,
      Title: row.title,
      PostTime: row.post_time,
      BoardID: row.board_id,
      BoardName: row.board_name,
      ReplyCount: row.reply_count,
      LastReplyUserID: row.last_reply_user_id,
      LastReplyTime: row.last_reply_time,
      Lock: LockData
    });
  }
  
  return new Result(true, "获得讨论列表成功", ResponseData);
});
