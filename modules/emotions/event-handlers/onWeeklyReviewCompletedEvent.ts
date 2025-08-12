import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onWeeklyReviewCompletedEvent = async (event: Emotions.Events.WeeklyReviewCompletedEventType) => {
  await db
    .update(Schema.weeklyReviews)
    .set({ status: Emotions.VO.WeeklyReviewStatusEnum.completed, insights: event.payload.insights })
    .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
};
