import { eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class GetLatestEntryTimestampForUser {
  static async execute(userId: Auth.VO.UserIdType): Promise<number | undefined> {
    const result = await db
      .select({ max: sql<number>`max(${Schema.entries.startedAt})` })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId));

    return result[0]?.max;
  }
}
