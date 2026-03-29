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

const DEFAULT_LIMIT = 50;

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const body = await readBody(event);
  const { Data } = body;
  
  // Support optional pagination
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const limit = clamp(Number.isFinite(Data?.Limit) ? Data.Limit : DEFAULT_LIMIT, 1, 200);
  const offset = clamp(Number.isFinite(Data?.Offset) ? Data.Offset : 0, 0, 10000);
  
  const Boards: Array<Object> = [];
  const BoardsData = ThrowErrorIfFailed(await auth.database.Select("bbs_board", [], undefined, { Limit: limit, Offset: offset }));
  for (const Board of BoardsData) {
    Boards.push({ BoardID: Board['board_id'], BoardName: Board['board_name'] });
  }
  return new Result(true, "获得板块列表成功", { Boards });
});
