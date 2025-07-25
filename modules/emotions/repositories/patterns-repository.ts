import type * as Auth from "+auth";
import * as Patterns from "+emotions/services/patterns";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";

export class PatternsRepository {
  static async create(event: Patterns.PatternDetectionEventType) {
    await db.insert(Schema.patternDetections).values({
      id: event.id,
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      weekIsoId: event.payload.weekIsoId,
    });
  }

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
