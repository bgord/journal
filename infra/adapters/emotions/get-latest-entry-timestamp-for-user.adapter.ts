import * as tools from "@bgord/tools";
import { eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type { GetLatestEntryTimestampForUser as GetLatestEntryTimestampForUserQuery } from "+emotions/queries/get-latest-entry-timestamp-for-user";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetLatestEntryTimestampForUserDrizzle implements GetLatestEntryTimestampForUserQuery {
  async execute(userId: Auth.VO.UserIdType) {
    const result = await db
      .select({ max: sql<number>`max(${Schema.entries.startedAt})` })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId));

    if (!result[0]?.max) return undefined;

    return tools.TimestampValue.parse(result[0].max);
  }
}

export const GetLatestEntryTimestampForUser = new GetLatestEntryTimestampForUserDrizzle();
