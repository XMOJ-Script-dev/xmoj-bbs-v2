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

export const CheckParams = (Data: object, Checklist: object): Result => {
  for (const i in Data) {
    if (Checklist[i] === undefined) {
      return new Result(false, "参数" + i + "未知");
    }
    const AvailableTypes = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
    if (AvailableTypes.indexOf(Checklist[i]) === -1) {
      return new Result(false, "参数类型" + Checklist[i] + "未知");
    }
    if (typeof Data[i] !== Checklist[i]) {
      return new Result(false, "参数" + i + "期望类型" + Checklist[i] + "实际类型" + typeof Data[i]);
    }
  }
  for (const i in Checklist) {
    if (Data[i] === undefined) {
      return new Result(false, "参数" + i + "未找到");
    }
  }
  return new Result(true, "参数检测通过");
}