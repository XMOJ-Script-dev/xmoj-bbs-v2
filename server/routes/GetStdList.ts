/* Copyright header omitted */
import { Result } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { cloudflare } = event.context;
  const ResponseData = { StdList: new Array<number>() };
  const list = await cloudflare.env.kv.get("std_list");
  ResponseData.StdList = (list || "").split("\n").filter(Boolean).map(Number);
  return new Result(true, "获得标程列表成功", ResponseData);
});
