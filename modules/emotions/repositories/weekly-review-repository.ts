import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export class WeeklyReviewRepository {
  static async getById(weeklyReviewId: VO.WeeklyReviewIdType) {
    return db.query.weeklyReviews.findFirst({ where: eq(Schema.weeklyReviews.id, weeklyReviewId) });
  }
}
