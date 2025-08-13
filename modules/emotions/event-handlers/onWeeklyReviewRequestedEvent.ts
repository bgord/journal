import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onWeeklyReviewRequestedEvent = async (event: Emotions.Events.WeeklyReviewRequestedEventType) => {
  await db.insert(Schema.weeklyReviews).values({
    id: event.payload.weeklyReviewId,
    status: Emotions.VO.WeeklyReviewStatusEnum.requested,
    createdAt: event.createdAt,
    userId: event.payload.userId,
    weekIsoId: event.payload.weekIsoId,
    insights: null,
  });
};
