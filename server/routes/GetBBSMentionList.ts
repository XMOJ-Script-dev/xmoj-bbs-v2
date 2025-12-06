/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const ResponseData = { MentionList: new Array<Object>() };
  const Mentions = ThrowErrorIfFailed(await auth.database.Select("bbs_mention", ["bbs_mention_id", "post_id", "bbs_mention_time", "reply_id"], { to_user_id: auth.username }));
  for (const i in Mentions) {
    const Mention = Mentions[i];
    const Post = ThrowErrorIfFailed(await auth.database.Select("bbs_post", ["user_id", "title"], { post_id: Mention['post_id'] }));
    if (Post.toString() === "") continue;
    const totalRepliesBefore = (await (auth.database as any).RawDatabase.prepare("SELECT COUNT(*) + 1 AS position FROM bbs_reply WHERE post_id = $1 AND reply_time < (SELECT reply_time FROM bbs_reply WHERE reply_id = $2)").bind(Mention['post_id'], Mention['reply_id']).run())['results'][0]['position'];
    const pageNumber = Math.floor(Number(totalRepliesBefore) / 15) + 1;
    ResponseData.MentionList.push({
      MentionID: Mention['bbs_mention_id'],
      PostID: Mention['post_id'],
      PostTitle: Post[0]['title'],
      MentionTime: Mention['bbs_mention_time'],
      PageNumber: pageNumber
    });
  }
  return new Result(true, "获得讨论提及列表成功", ResponseData);
});
