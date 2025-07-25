import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

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

  static async fail(event: Events.WeeklyReviewFailedEventType) {
    await db
      .update(Schema.weeklyReviews)
      .set({ status: VO.WeeklyReviewStatusEnum.failed })
      .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
  }

  static async complete(event: Events.WeeklyReviewCompletedEventType) {
    await db
      .update(Schema.weeklyReviews)
      .set({ status: VO.WeeklyReviewStatusEnum.completed, insights: event.payload.insights })
      .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
  }
}
