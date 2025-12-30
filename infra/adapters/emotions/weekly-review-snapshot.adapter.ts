import { eq } from "drizzle-orm";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class WeeklyReviewSnapshotDrizzle implements Emotions.Ports.WeeklyReviewSnapshotPort {
  async getById(id: Emotions.VO.WeeklyReviewIdType) {
    const review = (await db.query.weeklyReviews.findFirst({
      where: eq(Schema.weeklyReviews.id, id),
      columns: { id: true, userId: true, status: true },
    })) as Emotions.Ports.WeeklyReviewSnapshot | null;

    return review ?? null;
  }
}

export const WeeklyReviewSnapshot = new WeeklyReviewSnapshotDrizzle();
