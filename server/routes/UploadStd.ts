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
import { GetProblemScore } from "~/utils/xmoj";
import { Output } from "~/utils/output";
import { load, type CheerioAPI } from "cheerio";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth, cloudflare } = event.context;
  
  ThrowErrorIfFailed(CheckParams(Data, { "ProblemID": "number" }));
  const ProblemID = Data.ProblemID;
  if (ProblemID === 0) {
    return new Result(true, "ProblemID不能为0, 已忽略");
  }
  if (ThrowErrorIfFailed(await auth.database.GetTableSize("std_answer", { problem_id: ProblemID }))['TableSize'] !== 0) {
    let currentStdList = await cloudflare.env.kv.get("std_list");
    if (currentStdList && currentStdList.split('\n').every((d: string) => d !== String(ProblemID))) {
      currentStdList = currentStdList + ProblemID + "\n";
      await cloudflare.env.kv.put("std_list", currentStdList);
    }
    return new Result(true, "此题已经有人上传标程");
  }
  if (await GetProblemScore(ProblemID, auth.username, auth.sessionID) !== 100) {
    return new Result(false, "没有权限上传此标程");
  }
  let StdCode: string = "";
  let PageIndex: number = 0;
  const MAX_PAGES = 50; // Prevent infinite loop
  let lastPageContent = "";
  while (StdCode === "" && PageIndex < MAX_PAGES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    await fetch(new URL("https://www.xmoj.tech/problemstatus.php?id=" + ProblemID + "&page=" + PageIndex), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID }, signal: controller.signal })
      .then((Response) => Response.text())
      .then(async (Response) => {
        // Detect if we're stuck on the same page (no more results)
        if (Response === lastPageContent) {
          StdCode = "这道题没有标程（即用户std没有AC这道题）";
          return;
        }
        lastPageContent = Response;
        if (Response.indexOf("[NEXT]") === -1) { StdCode = "这道题没有标程（即用户std没有AC这道题）"; return; }
        const ParsedDocument: CheerioAPI = load(Response);
        const SubmitTable = ParsedDocument("#problemstatus");
        if (SubmitTable.length == 0) { Output.Error("Get Std code failed: Cannot find submit table"); ThrowErrorIfFailed(new Result(false, "获取标程失败")); }
        const SubmitTableBody = SubmitTable.children().eq(1);
        for (let i = 1; i < SubmitTableBody.children().length; i++) {
          const SubmitRow = SubmitTableBody.children().eq(i);
          if (SubmitRow.children().eq(2).text().trim() === "std") {
            let SID: string = SubmitRow.children().eq(1).text();
            if (SID.indexOf("(") != -1) SID = SID.substring(0, SID.indexOf("("));
            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 10000);
            await fetch(new URL("https://www.xmoj.tech/getsource.php?id=" + SID), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID }, signal: controller2.signal })
              .then((Response) => Response.text())
              .then((Response) => {
                Response = Response.substring(0, Response.indexOf("<!--not cached-->")).trim();
                if (Response === "I am sorry, You could not view this code!") { Output.Error("Get Std code failed: Cannot view code"); ThrowErrorIfFailed(new Result(false, "获取标程失败")); }
                Response = Response.substring(0, Response.indexOf("/**************************************************************")).trim();
                StdCode = Response;
              }).finally(() => clearTimeout(timeout2));
          }
        }
      }).catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取标程失败")); })
      .finally(() => clearTimeout(timeout));
    PageIndex++;
  }
  // If MAX_PAGES reached or no std found message, trigger fallback
  if (StdCode === "" || StdCode === "这道题没有标程（即用户std没有AC这道题）") {
    StdCode = "";
    let SID: string = "0";
    {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      await fetch(new URL("https://www.xmoj.tech/status.php?problem_id=" + ProblemID + "&jresult=4"), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID }, signal: controller.signal })
      .then((response) => response.text())
      .then((body) => { 
        const $ = load(body); 
        const htmlContent = $(".oddrow > td:nth-child(2)").html();
        if (htmlContent === null) {
          ThrowErrorIfFailed(new Result(false, "无法找到提交记录"));
        }
        SID = htmlContent as string; 
      })
      .catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取SID失败")); })
      .finally(() => clearTimeout(timeout));
    }
    {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      await fetch(new URL("https://www.xmoj.tech/getsource.php?id=" + SID), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID }, signal: controller.signal })
      .then((Response) => Response.text())
      .then((Response) => { StdCode = Response.substring(0, Response.indexOf("/**************************************************************")).trim(); })
      .catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取标程失败")); })
      .finally(() => clearTimeout(timeout));
    }
    StdCode = '//Code by ' + auth.username + '\n' + StdCode;
  }
  ThrowErrorIfFailed(await auth.database.Insert("std_answer", { problem_id: ProblemID, std_code: StdCode }));
  let currentStdList = await cloudflare.env.kv.get("std_list");
  currentStdList = (currentStdList || "") + ProblemID + "\n";
  await cloudflare.env.kv.put("std_list", currentStdList);
  return new Result(true, "标程上传成功");
});
