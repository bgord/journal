import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq, gte } from "drizzle-orm";

export class CountTodaysAlarmsForUser {
  static async execute(userId: Auth.VO.UserIdType): Promise<{ count: number }> {
    const startOfDay = tools.DateCalculator.getStartOfDayTsInTz({
      now: tools.Timestamp.parse(Date.now()),
      timeZoneOffsetMs: 0,
    });

    return {
      count: await db.$count(
        Schema.alarms,
        and(gte(Schema.alarms.generatedAt, startOfDay), eq(Schema.alarms.userId, userId)),
      ),
    };
  }
}
