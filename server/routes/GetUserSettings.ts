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
import { Output } from "~/utils/output";

export default eventHandler(async (event) => {
  try {
    const { auth } = event.context;

    const SettingsData: any[] = ThrowErrorIfFailed(
      await auth.database.Select("user_settings", ["settings"], {
        user_id: auth.username
      })
    );

    if (SettingsData.length === 0) {
      return new Result(true, "获得设置成功", { Settings: {} });
    }

    let SettingsObject: object;
    try {
      SettingsObject = JSON.parse(SettingsData[0]["settings"]);
    } catch (_) {
      return new Result(false, "设置数据损坏");
    }
    if (typeof SettingsObject !== "object" || Array.isArray(SettingsObject) || SettingsObject === null) {
      return new Result(false, "设置数据损坏");
    }

    return new Result(true, "获得设置成功", { Settings: SettingsObject });
  } catch (error) {
    if (error instanceof Result) return error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    Output.Error("GetUserSettings error: " + errorMsg);
    return new Result(false, "获得设置失败: " + errorMsg);
  }
});
