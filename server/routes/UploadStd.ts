/* Copyright header omitted */
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
    if (currentStdList && currentStdList.split('\n').every(d => d !== String(ProblemID))) {
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
  while (StdCode === "") {
    await fetch(new URL("https://www.xmoj.tech/problemstatus.php?id=" + ProblemID + "&page=" + PageIndex), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID } })
      .then((Response) => Response.text())
      .then(async (Response) => {
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
            await fetch(new URL("https://www.xmoj.tech/getsource.php?id=" + SID), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID } })
              .then((Response) => Response.text())
              .then((Response) => {
                Response = Response.substring(0, Response.indexOf("<!--not cached-->")).trim();
                if (Response === "I am sorry, You could not view this code!") { Output.Error("Get Std code failed: Cannot view code"); ThrowErrorIfFailed(new Result(false, "获取标程失败")); }
                Response = Response.substring(0, Response.indexOf("/**************************************************************")).trim();
                StdCode = Response;
              });
          }
        }
      }).catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取标程失败")); });
    PageIndex++;
  }
  if (StdCode === "这道题没有标程（即用户std没有AC这道题）") {
    StdCode = "";
    let SID: string = "0";
    await fetch(new URL("https://www.xmoj.tech/status.php?problem_id=" + ProblemID + "&jresult=4"), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID } })
      .then((response) => response.text())
      .then((body) => { const $ = load(body); SID = $(".oddrow > td:nth-child(2)").html() as string; })
      .catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取SID失败")); });
    await fetch(new URL("https://www.xmoj.tech/getsource.php?id=" + SID), { headers: { "Cookie": "PHPSESSID=" + auth.sessionID } })
      .then((Response) => Response.text())
      .then((Response) => { StdCode = Response.substring(0, Response.indexOf("/**************************************************************")).trim(); })
      .catch((Error) => { Output.Error("Get Std code failed: " + Error); ThrowErrorIfFailed(new Result(false, "获取标程失败")); });
    StdCode = '//Code by ' + auth.username + '\n' + StdCode;
  }
  ThrowErrorIfFailed(await auth.database.Insert("std_answer", { problem_id: ProblemID, std_code: StdCode }));
  let currentStdList = await cloudflare.env.kv.get("std_list");
  currentStdList = (currentStdList || "") + ProblemID + "\n";
  await cloudflare.env.kv.put("std_list", currentStdList);
  return new Result(true, "标程上传成功");
});
