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
    return new Result(false, "没有权限删除此标签");
  }
  ThrowErrorIfFailed(await auth.database.Delete("badge", { user_id: Data.UserID }));
  return new Result(true, "删除标签成功");
});
