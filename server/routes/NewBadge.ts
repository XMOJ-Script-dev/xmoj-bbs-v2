/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";
import { CheckParams } from "~/utils/checkParams";
import { IsAdminAsync } from "~/utils/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { Data } = body;
  const { auth } = event.context;
  ThrowErrorIfFailed(CheckParams(Data, { "UserID": "string" }));
  if (!(await IsAdminAsync(auth.username, auth.database))) {
    return new Result(false, "没有权限创建此标签");
  }
  ThrowErrorIfFailed(await auth.database.Insert("badge", { user_id: Data.UserID }));
  return new Result(true, "创建标签成功");
});
