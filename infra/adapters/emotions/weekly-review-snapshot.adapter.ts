import { eq } from "drizzle-orm";
import type {
  WeeklyReviewSnapshotPort,
  WeeklyReviewSnapshot as WeeklyReviewSnapshotType,
} from "+emotions/ports";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class WeeklyReviewSnapshotDrizzle implements WeeklyReviewSnapshotPort {
  async getById(id: string) {
    const review = (await db.query.weeklyReviews.findFirst({
      where: eq(Schema.weeklyReviews.id, id),
      columns: { id: true, userId: true, status: true },
    })) as WeeklyReviewSnapshotType | null;

    return review ?? null;
  }
}

export function createWeeklyReviewSnapshot() {
  return new WeeklyReviewSnapshotDrizzle();
}
