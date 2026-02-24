/* Copyright header omitted */
import { Result, ThrowErrorIfFailed } from "~/utils/resultUtils";

export default eventHandler(async (event) => {
  const { auth } = event.context;
  const body = await readBody(event);
  const { Data } = body || {};
  const limit = Data?.Limit && Data.Limit > 0 ? Data.Limit : 50;
  const offset = Data?.Offset || 0;
  const ResponseData: { MentionList: any[] } = { MentionList: [] };
  const Mentions: any[] = ThrowErrorIfFailed(await auth.database.Select("bbs_mention", ["bbs_mention_id", "post_id", "bbs_mention_time", "reply_id"], { to_user_id: auth.username }, { Limit: limit, Offset: offset }));
  
  if (Mentions.length === 0) {
    return new Result(true, "获得讨论提及列表成功", ResponseData);
  }
  
  // Get all post IDs to fetch in one query
  const postIds = Mentions.map((m: any) => m['post_id']);
  
  // Fetch all posts at once using IN clause via ExecuteComplexQuery for proper validation
  const postsQuery = `SELECT post_id, user_id, title FROM bbs_post WHERE post_id IN (${postIds.map(() => '?').join(',')})`;
  const PostsResult: any = ThrowErrorIfFailed(await auth.database.ExecuteComplexQuery(postsQuery, postIds));
  const postsMap: Map<any, any> = new Map(PostsResult.Data.results.map((p: any) => [p.post_id, p]));
  
  for (const Mention of Mentions) {
    const Post: any = postsMap.get(Mention['post_id']);
    if (!Post) continue;
    
    // Use ExecuteComplexQuery instead of RawDatabase to validate SQL
    const positionQuery = `SELECT COUNT(*) + 1 AS position FROM bbs_reply WHERE post_id = ? AND reply_time < (SELECT reply_time FROM bbs_reply WHERE reply_id = ?)`;
    const PositionResult: any = ThrowErrorIfFailed(await auth.database.ExecuteComplexQuery(positionQuery, [Mention['post_id'], Mention['reply_id']]));
    const totalRepliesBefore = PositionResult.Data.results[0]['position'];
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
