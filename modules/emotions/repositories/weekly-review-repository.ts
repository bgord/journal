import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class WeeklyReviewRepository {
  static async create(event: Events.WeeklyReviewRequestedEventType) {
    await db.insert(Schema.weeklyReviews).values({
      id: event.payload.weeklyReviewId,
      status: VO.WeeklyReviewStatusEnum.requested,
      createdAt: event.createdAt,
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      insights: null,
    });
  }

  static async createSkipped(event: Events.WeeklyReviewSkippedEventType) {
    await db.insert(Schema.weeklyReviews).values({
      status: VO.WeeklyReviewStatusEnum.skipped,
      createdAt: event.createdAt,
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      insights: null,
    });
  }
}
