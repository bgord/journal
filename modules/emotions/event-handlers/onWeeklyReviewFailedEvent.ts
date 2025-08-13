import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onWeeklyReviewFailedEvent = async (event: Emotions.Events.WeeklyReviewFailedEventType) => {
  await db
    .update(Schema.weeklyReviews)
    .set({ status: Emotions.VO.WeeklyReviewStatusEnum.failed })
    .where(eq(Schema.weeklyReviews.id, event.payload.weeklyReviewId));
};
