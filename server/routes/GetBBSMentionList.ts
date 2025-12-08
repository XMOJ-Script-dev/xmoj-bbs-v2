/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const body = await readBody(event);
  const { Data } = body || {};
  const limit = Data?.Limit && Data.Limit > 0 ? Data.Limit : 50;
  const offset = Data?.Offset || 0;
  const ResponseData = { MentionList: new Array<Object>() };
  const Mentions = ThrowErrorIfFailed(await auth.database.Select("bbs_mention", ["bbs_mention_id", "post_id", "bbs_mention_time", "reply_id"], { to_user_id: auth.username }, { Limit: limit, Offset: offset }));
  
  if (Mentions.length === 0) {
    return new Result(true, "获得讨论提及列表成功", ResponseData);
  }
  
  // Get all post IDs to fetch in one query
  const postIds = Mentions.map(m => m['post_id']);
  
  // Fetch all posts at once using IN clause
  const postsQuery = `SELECT post_id, user_id, title FROM bbs_post WHERE post_id IN (${postIds.map(() => '?').join(',')})`;
  const Posts = await (auth.database as any).RawDatabase.prepare(postsQuery).bind(...postIds).all();
  const postsMap = new Map(Posts.results.map((p: any) => [p.post_id, p]));
  
  for (const Mention of Mentions) {
    const Post = postsMap.get(Mention['post_id']);
    if (!Post) continue;
    
    const totalRepliesBefore = (await (auth.database as any).RawDatabase.prepare("SELECT COUNT(*) + 1 AS position FROM bbs_reply WHERE post_id = $1 AND reply_time < (SELECT reply_time FROM bbs_reply WHERE reply_id = $2)").bind(Mention['post_id'], Mention['reply_id']).run())['results'][0]['position'];
    const pageNumber = Math.floor(Number(totalRepliesBefore) / 15) + 1;
    ResponseData.MentionList.push({
      MentionID: Mention['bbs_mention_id'],
      PostID: Mention['post_id'],
      PostTitle: Post['title'],
      MentionTime: Mention['bbs_mention_time'],
      PageNumber: pageNumber
    });
  }
  return new Result(true, "获得讨论提及列表成功", ResponseData);
});
