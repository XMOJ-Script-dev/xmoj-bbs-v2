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

type TypeSpec = string | { type: string; min?: number; max?: number; enum?: any[]; maxLength?: number; minLength?: number; maxBytes?: number };

export const CheckParams = (Data: object, Checklist: Record<string, TypeSpec>): Result => {
  for (const key of Object.keys(Data as any)) {
    if ((Checklist as any)[key] === undefined) {
      return new Result(false, "参数" + key + "未知");
    }
    const spec: TypeSpec = (Checklist as any)[key];
    const expectedType = typeof spec === 'string' ? spec : spec.type;
    const AvailableTypes = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
    if (AvailableTypes.indexOf(expectedType) === -1) {
      return new Result(false, "参数类型" + expectedType + "未知");
    }
    const actual = (Data as any)[key];
    
    // Add null/undefined check
    if (actual === null || actual === undefined) {
      return new Result(false, "参数" + key + "不能为空");
    }
    
    if (typeof actual !== expectedType) {
      return new Result(false, "参数" + key + "期望类型" + expectedType + "实际类型" + typeof actual);
    }
    if (typeof spec !== 'string') {
      if (spec.min !== undefined && typeof actual === 'number' && actual < spec.min) {
        return new Result(false, "参数" + key + "小于最小值" + spec.min);
      }
      if (spec.max !== undefined && typeof actual === 'number' && actual > spec.max) {
        return new Result(false, "参数" + key + "大于最大值" + spec.max);
      }
      // Add minLength support
      if (spec.minLength !== undefined && typeof actual === 'string' && actual.length < spec.minLength) {
        return new Result(false, "参数" + key + "长度小于最小值" + spec.minLength);
      }
      if (spec.maxLength !== undefined && typeof actual === 'string' && actual.length > spec.maxLength) {
        return new Result(false, "参数" + key + "长度超过最大值" + spec.maxLength);
      }
      // Add byte length check (UTF-8 byte count)
      if (spec.maxBytes !== undefined && typeof actual === 'string') {
        const byteLength = new TextEncoder().encode(actual).length;
        if (byteLength > spec.maxBytes) {
          return new Result(false, "参数" + key + "字节长度超过最大值" + spec.maxBytes);
        }
      }
      if (spec.enum && !spec.enum.includes(actual)) {
        return new Result(false, "参数" + key + "不在允许范围内");
      }
    }
  }
  for (const key of Object.keys(Checklist as any)) {
    if ((Data as any)[key] === undefined) {
      return new Result(false, "参数" + key + "未找到");
    }
  }
  return new Result(true, "参数检测通过");
}