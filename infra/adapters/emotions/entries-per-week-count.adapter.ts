import type * as tools from "@bgord/tools";
import { and, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import type { EntriesPerWeekCountQuery } from "+emotions/queries/entries-per-week-count";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class EntriesPerWeekCountDrizzle implements EntriesPerWeekCountQuery {
  async execute(userId: Auth.VO.UserIdType, week: tools.Week) {
    return db.$count(
      Schema.entries,
      and(
        gte(Schema.entries.startedAt, week.getStart().ms),
        lte(Schema.entries.startedAt, week.getEnd().ms),
        eq(Schema.entries.userId, userId),
      ),
    );
  }
}

export function createEntriesPerWeekCount(): EntriesPerWeekCountQuery {
  return new EntriesPerWeekCountDrizzle();
}
