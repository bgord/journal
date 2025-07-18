import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq, gte, lte } from "drizzle-orm";

export class CountEntriesPerWeekForUser {
  static async execute(userId: Auth.VO.UserIdType, weekStartedAt: number): Promise<number> {
    const weekEndedAt = weekStartedAt - tools.Time.Days(7).ms;

    return db.$count(
      Schema.entries,
      and(
        gte(Schema.entries.startedAt, weekStartedAt),
        lte(Schema.entries.startedAt, weekEndedAt),
        eq(Schema.entries.userId, userId),
      ),
    );
  }
}
