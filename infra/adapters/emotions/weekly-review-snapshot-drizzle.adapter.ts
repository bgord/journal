import { eq } from "drizzle-orm";
import type { WeeklyReviewSnapshot, WeeklyReviewSnapshotPort } from "+emotions/ports";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class WeeklyReviewSnapshotDrizzle implements WeeklyReviewSnapshotPort {
  async getById(id: string): Promise<WeeklyReviewSnapshot | null> {
    const review = (await db.query.weeklyReviews.findFirst({
      where: eq(Schema.weeklyReviews.id, id),
      columns: { id: true, userId: true, status: true },
    })) as WeeklyReviewSnapshot | null;

    return review ?? null;
  }
}
