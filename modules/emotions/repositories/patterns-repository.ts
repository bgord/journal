import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";

export class PatternsRepository {
  static async findInWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType) {
    return db
      .select()
      .from(Schema.patternDetections)
      .where(
        and(
          eq(Schema.patternDetections.weekIsoId, week.toIsoId()),
          eq(Schema.patternDetections.userId, userId),
        ),
      );
  }
}
