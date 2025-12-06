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

import { H3Error, H3Event } from "h3";
import { Result } from "~/utils/resultUtils";
import { Output } from "~/utils/output";

export default defineNitroErrorHandler((error: H3Error, event: H3Event) => {
  if (error instanceof Result) {
    setResponseHeader(event, 'Content-Type', 'application/json');
    return send(event, error.toString());
  }
  
  Output.Error(error);
  const result = new Result(false, "服务器运行错误：" + String(error).split("\n")[0]);
  setResponseHeader(event, 'Content-Type', 'application/json');
  return send(event, result.toString());
});

