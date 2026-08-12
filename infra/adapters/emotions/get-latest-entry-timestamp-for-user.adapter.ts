import type * as tools from "@bgord/tools";
import { eq, max } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetLatestEntryTimestampForUserQueryDrizzle implements Emotions.Queries.GetLatestEntryTimestampForUser {
  async execute(userId: Auth.VO.UserIdType): Promise<tools.TimestampValueType | undefined> {
    const result = await db
      .select({ max: max(Schema.entries.startedAt) })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId));

    return result[0]?.max ?? undefined;
  }
}

export const GetLatestEntryTimestampForUserQuery = new GetLatestEntryTimestampForUserQueryDrizzle();
