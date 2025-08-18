import * as tools from "@bgord/tools";
import { and, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import type { EntriesPerWeekCountQuery } from "+emotions/queries/entries-per-week-count";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class EntriesPerWeekCountDrizzle implements EntriesPerWeekCountQuery {
  async execute(userId: Auth.VO.UserIdType, week: tools.Week) {
    return db.$count(
      Schema.entries,
      and(
        gte(Schema.entries.startedAt, week.getStart()),
        lte(Schema.entries.startedAt, week.getEnd()),
        eq(Schema.entries.userId, userId),
      ),
    );
  }
}
