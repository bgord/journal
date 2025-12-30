import * as tools from "@bgord/tools";
import { and, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class EntriesPerWeekCountQueryDrizzle implements Emotions.Queries.EntriesPerWeekCountQuery {
  async execute(userId: Auth.VO.UserIdType, week: tools.Week) {
    const result = await db.$count(
      Schema.entries,
      and(
        gte(Schema.entries.startedAt, week.getStart().ms),
        lte(Schema.entries.startedAt, week.getEnd().ms),
        eq(Schema.entries.userId, userId),
      ),
    );

    return tools.IntegerNonNegative.parse(result);
  }
}

export const EntriesPerWeekCountQuery = new EntriesPerWeekCountQueryDrizzle();
