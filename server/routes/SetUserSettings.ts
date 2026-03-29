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
import { Output } from "~/utils/output";

const MAX_SETTINGS_LENGTH = 10000;

export default eventHandler(async (event) => {
  try {
    const { auth } = event.context;
    const body = await readBody(event);
    const { Data } = body || {};

    ThrowErrorIfFailed(CheckParams(Data, {
      "Settings": "string"
    }));

    const SettingsString: string = Data["Settings"];
    if (SettingsString.length > MAX_SETTINGS_LENGTH) {
      return new Result(false, "设置内容过大");
    }

    let SettingsObject: object;
    try {
      SettingsObject = JSON.parse(SettingsString);
    } catch (_) {
      return new Result(false, "设置格式有误");
    }
    if (typeof SettingsObject !== "object" || Array.isArray(SettingsObject) || SettingsObject === null) {
      return new Result(false, "设置格式有误");
    }

    const existingSize = ThrowErrorIfFailed(
      await auth.database.GetTableSize("user_settings", { user_id: auth.username })
    )["TableSize"];

    if (existingSize === 0) {
      ThrowErrorIfFailed(await auth.database.Insert("user_settings", {
        user_id: auth.username,
        settings: SettingsString
      }));
    } else {
      ThrowErrorIfFailed(await auth.database.Update("user_settings", {
        settings: SettingsString
      }, {
        user_id: auth.username
      }));
    }

    return new Result(true, "保存设置成功");
  } catch (error) {
    if (error instanceof Result) return error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    Output.Error("SetUserSettings error: " + errorMsg);
    return new Result(false, "保存设置失败: " + errorMsg);
  }
});
