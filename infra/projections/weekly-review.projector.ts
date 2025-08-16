import * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class WeeklyReviewProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
      EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_FAILED_EVENT,
      EventHandler.handle(this.onWeeklyReviewFailedEvent.bind(this)),
    );
  }

  async onWeeklyReviewSkippedEvent(event: Emotions.Events.WeeklyReviewSkippedEventType) {
    await db.insert(Schema.weeklyReviews).values({
      status: Emotions.VO.WeeklyReviewStatusEnum.skipped,
      createdAt: event.createdAt,
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      insights: null,
    });
  }

  async onWeeklyReviewRequestedEvent(event: Emotions.Events.WeeklyReviewRequestedEventType) {
    await db.insert(Schema.weeklyReviews).values({
      id: event.payload.weeklyReviewId,
      status: Emotions.VO.WeeklyReviewStatusEnum.requested,
      createdAt: event.createdAt,
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      insights: null,
    });
  }

  async onWeeklyReviewCompletedEvent(event: Emotions.Events.WeeklyReviewCompletedEventType) {
    await db
      .update(Schema.weeklyReviews)
      .set({ status: Emotions.VO.WeeklyReviewStatusEnum.completed, insights: event.payload.insights })
      .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
  }

  async onWeeklyReviewFailedEvent(event: Emotions.Events.WeeklyReviewFailedEventType) {
    await db
      .update(Schema.weeklyReviews)
      .set({ status: Emotions.VO.WeeklyReviewStatusEnum.failed })
      .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
  }
}
