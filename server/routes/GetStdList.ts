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

import { Result } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { cloudflare } = event.context;
  const ResponseData = { StdList: new Array<number>() };
  const list = await cloudflare.env.kv.get("std_list");
  ResponseData.StdList = (list || "").split("\n").filter(Boolean).map(Number);
  return new Result(true, "获得标程列表成功", ResponseData);
});
