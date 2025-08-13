import * as tools from "@bgord/tools";
import { and, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class CountEntriesPerWeekForUser {
  static async execute(userId: Auth.VO.UserIdType, week: tools.Week): Promise<number> {
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
