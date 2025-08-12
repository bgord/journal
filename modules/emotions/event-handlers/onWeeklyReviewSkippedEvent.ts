import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onWeeklyReviewSkippedEvent = async (event: Emotions.Events.WeeklyReviewSkippedEventType) => {
  await db.insert(Schema.weeklyReviews).values({
    status: Emotions.VO.WeeklyReviewStatusEnum.skipped,
    createdAt: event.createdAt,
    userId: event.payload.userId,
    weekIsoId: event.payload.weekIsoId,
    insights: null,
  });
};
