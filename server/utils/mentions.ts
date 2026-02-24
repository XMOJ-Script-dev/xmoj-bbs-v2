/*
 *     Copyright (C) 2023-2025  XMOJ-bbs contributors
 *     This file is part of XMOJ-bbs.
 *     XMOJ-bbs is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     XMOJ-bbs is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with XMOJ-bbs.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ThrowErrorIfFailed } from "~/utils/resultUtils";
import { Database } from "~/utils/database";
import { Output } from "~/utils/output";

/**
 * Push notification to Durable Object
 * Failures are intentionally swallowed to avoid affecting main request flow
 * Mirrors Process.ts pushNotification behavior (compatible with /notify endpoint)
 * Uses X-Notification-Token header for authentication if configured
 */
async function PushNotification(
  notificationNamespace: DurableObjectNamespace | undefined,
  userId: string,
  notificationType: 'bbs_mention' | 'mail_mention',
  data: Record<string, any>,
  notificationToken?: string
): Promise<void> {
  try {
    if (!notificationNamespace) {
      return;
    }

    // Get stub for the notification object (one per user)
    const stub = notificationNamespace.get(
      notificationNamespace.idFromName(userId)
    );

    // Build headers with authentication token if configured
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (notificationToken) {
      headers['X-Notification-Token'] = notificationToken;
    }

    // Push notification via HTTP request to /notify endpoint (compatible with Process.ts)
    await stub.fetch(new Request('https://dummy/notify', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        type: notificationType,
        data,
        notification: { userId, type: notificationType, data }  // Support both formats
      })
    }));
  } catch (_error) {
    // Silently swallow errors - notifications are non-critical
    // This matches Process.ts behavior: errors don't affect the response
  }
}

export async function AddBBSMention(
  ToUserID: string,
  FromUserID: string,
  PostID: number,
  ReplyID: number,
  XMOJDatabase: Database,
  notificationNamespace?: DurableObjectNamespace,
  notificationToken?: string
): Promise<void> {
  if (ToUserID === FromUserID) {
    return;
  }
  // Use INSERT OR REPLACE pattern to handle race conditions atomically
  try {
    const result = ThrowErrorIfFailed(await XMOJDatabase.Insert("bbs_mention", {
      to_user_id: ToUserID,
      from_user_id: FromUserID,
      post_id: PostID,
      bbs_mention_time: new Date().getTime(),
      reply_id: ReplyID
    }));

    const mentionId = (result as any).InsertID;

    // Push real-time notification via Durable Object
    if (mentionId) {
      await PushNotification(notificationNamespace, ToUserID, 'bbs_mention', {
        mentionId,
        fromUserID: FromUserID,
        postID: PostID,
        replyID: ReplyID,
        mentionTime: new Date().getTime()
      }, notificationToken);
    }
  } catch (error) {
    // If insert fails due to unique constraint, update existing record
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('UNIQUE') || errMsg.includes('duplicate')) {
      try {
        await XMOJDatabase.Update("bbs_mention", {
          bbs_mention_time: new Date().getTime(),
          reply_id: ReplyID
        }, {
          to_user_id: ToUserID,
          post_id: PostID
        });

        // Still push notification for updated mention
        await PushNotification(notificationNamespace, ToUserID, 'bbs_mention', {
          fromUserID: FromUserID,
          postID: PostID,
          replyID: ReplyID,
          mentionTime: new Date().getTime(),
          updated: true
        }, notificationToken);
      } catch (updateError) {
        // Log but don't fail on update errors
        Output.Error("Failed to update BBS mention: " + (updateError instanceof Error ? updateError.message : String(updateError)));
      }
    } else {
      // Re-throw non-constraint errors
      throw error;
    }
  }
}

export async function AddMailMention(
  FromUserID: string,
  ToUserID: string,
  MessageID: number,
  XMOJDatabase: Database,
  notificationNamespace?: DurableObjectNamespace,
  notificationToken?: string
): Promise<void> {
  // Use INSERT OR REPLACE pattern to handle race conditions atomically
  try {
    const result = ThrowErrorIfFailed(await XMOJDatabase.Insert("short_message_mention", {
      message_id: MessageID,
      from_user_id: FromUserID,
      to_user_id: ToUserID,
      mention_time: new Date().getTime()
    }));

    const mentionId = (result as any).InsertID;

    // Push real-time notification via Durable Object
    if (mentionId) {
      await PushNotification(notificationNamespace, ToUserID, 'mail_mention', {
        mentionId,
        fromUserID: FromUserID,
        messageID: MessageID,
        mentionTime: new Date().getTime()
      }, notificationToken);
    }
  } catch (error) {
    // If insert fails due to unique constraint, update existing record
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('UNIQUE') || errMsg.includes('duplicate')) {
      try {
        await XMOJDatabase.Update("short_message_mention", {
          message_id: MessageID,
          mention_time: new Date().getTime()
        }, {
          from_user_id: FromUserID,
          to_user_id: ToUserID
        });

        // Still push notification for updated mention
        await PushNotification(notificationNamespace, ToUserID, 'mail_mention', {
          fromUserID: FromUserID,
          messageID: MessageID,
          mentionTime: new Date().getTime(),
          updated: true
        }, notificationToken);
      } catch (updateError) {
        // Log but don't fail on update errors
        Output.Error("Failed to update mail mention: " + (updateError instanceof Error ? updateError.message : String(updateError)));
      }
    } else {
      // Re-throw non-constraint errors
      throw error;
    }
  }
}

