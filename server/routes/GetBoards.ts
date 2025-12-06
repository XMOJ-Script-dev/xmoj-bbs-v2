/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const Boards: Array<Object> = [];
  const BoardsData = ThrowErrorIfFailed(await auth.database.Select("bbs_board", []));
  for (const i in BoardsData) {
    const Board = BoardsData[i];
    Boards.push({ BoardID: Board['board_id'], BoardName: Board['board_name'] });
  }
  return new Result(true, "获得板块列表成功", { Boards });
});
