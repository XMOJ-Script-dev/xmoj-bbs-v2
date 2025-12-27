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

import { Result, ThrowErrorIfFailed } from "./resultUtils";
import { Database } from "./database";
import { Output } from "./output";
import { load, type CheerioAPI } from "cheerio";

export async function IfUserExist(Username: string, XMOJDatabase: Database): Promise<Result> {
  if (Username !== Username.toLowerCase()) {
    return new Result(false, "用户名必须为小写");
  }
  if (ThrowErrorIfFailed(await XMOJDatabase.GetTableSize("phpsessid", {
    user_id: Username
  }))["TableSize"] > 0) {
    return new Result(true, "用户检查成功", {
      "Exist": true
    });
  }
  {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(new URL("https://www.xmoj.tech/userinfo.php?user=" + encodeURIComponent(Username)), { signal: controller.signal })
    .then((Response) => {
      return Response.text();
    }).then((Response) => {
      return new Result(true, "用户检查成功", {
        "Exist": Response.indexOf("No such User!") === -1
      });
    }).catch((Error) => {
      Output.Error("Check user exist failed: " + Error + "\n" +
        "Username: \"" + Username + "\"\n");
      return new Result(false, "用户检查失败: " + Error);
    }).finally(() => clearTimeout(timeout));
    return res;
  }
}

export async function GetProblemScore(ProblemID: number, Username: string, SessionID: string): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  return await fetch(new URL("https://www.xmoj.tech/status.php?user_id=" + encodeURIComponent(Username) + "&problem_id=" + ProblemID), {
    headers: {
      "Cookie": "PHPSESSID=" + SessionID,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "permissions-policy": "browsing-topics=()",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    method: "GET",
    signal: controller.signal
  })
    .then((Response) => {
      return Response.text();
    }).then((Response) => {
      const ParsedDocument: CheerioAPI = load(Response);
      const ResultTable = ParsedDocument("#result-tab");
      if (ResultTable.length == 0) {
        Output.Error("Get problem score failed: Cannot find table element\n" +
          "ProblemID: \"" + ProblemID + "\"\n" +
          "Username : \"" + Username + "\"\n");
        return 0;
      }
      let MaxScore: number = 0;
      const ResultTableBody = ResultTable.children().eq(1);
      for (let i = 0; i < ResultTableBody.children().length; i++) {
        const ResultRow = ResultTableBody.children().eq(i);
        if (ResultRow.children().eq(4).text().trim() === "正确") {
          return 100;
        } else if (ResultRow.children().eq(4).children().length == 2) {
          const ScoreSpan = ResultRow.children().eq(4).children().eq(1);
          if (ScoreSpan.length == 0) {
            Output.Error("Get problem score failed: Cannot find score span\n" +
              "ProblemID: \"" + ProblemID + "\"\n" +
              "Username : \"" + Username + "\"\n");
            return 0;
          }
          const Score: string = ScoreSpan.text().trim();
          MaxScore = Math.max(MaxScore, parseInt(Score.substring(0, Score.length - 1)));
        }
      }
      return MaxScore;
    }).catch((Error) => {
      Output.Error("Get user score failed: " + Error + "\n" +
        "ProblemID: \"" + ProblemID + "\"\n" +
        "Username : \"" + Username + "\"\n");
      ThrowErrorIfFailed(new Result(false, "获取题目分数失败"));
      return 0;
    }).finally(() => clearTimeout(timeout));
}
