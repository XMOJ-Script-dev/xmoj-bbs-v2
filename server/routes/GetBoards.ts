/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";

const DEFAULT_LIMIT = 50;

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const body = await readBody(event);
  const { Data } = body;
  
  // Support optional pagination
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const limit = clamp(Number.isFinite(Data?.Limit) ? Data.Limit : DEFAULT_LIMIT, 1, 200);
  const offset = clamp(Number.isFinite(Data?.Offset) ? Data.Offset : 0, 0, 10000);
  
  const Boards: Array<Object> = [];
  const BoardsData = ThrowErrorIfFailed(await auth.database.Select("bbs_board", [], undefined, { Limit: limit, Offset: offset }));
  for (const Board of BoardsData) {
    Boards.push({ BoardID: Board['board_id'], BoardName: Board['board_name'] });
  }
  return new Result(true, "获得板块列表成功", { Boards });
});
