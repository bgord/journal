import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import type { EventBusType } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: EventBusType; EventHandler: bg.EventHandlerPort };

export class WeeklyReviewProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_FAILED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewFailedEvent.bind(this)),
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
