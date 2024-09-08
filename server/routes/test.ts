import {Result} from "~/utils/resultUtils.ts";

export default eventHandler(async (event) => {
  return new Response("haha", {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  });
});