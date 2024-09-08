import {Result} from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const notice = await cloudflare.env.kv.get("noticeboard");
  let resp: Result;
  if (notice === null) {
    resp = new Result(false, "未找到公告");
  } else {
    resp = new Result(true, "获得公告成功", {"Notice": notice});
  }
  return new Response(JSON.stringify(resp), {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  });
});