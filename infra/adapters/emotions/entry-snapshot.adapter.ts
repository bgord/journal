import type * as tools from "@bgord/tools";
import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class EntrySnapshotDrizzle implements Emotions.Ports.EntrySnapshotPort {
  async getById(entryId: Emotions.VO.EntryIdType): Promise<Emotions.VO.EntrySnapshot | undefined> {
    const entry = await db.query.entries.findFirst({
      where: eq(Schema.entries.id, entryId),
    });

    return entry ?? undefined;
  }

  async getByWeekForUser(
    week: tools.Week,
    userId: Auth.VO.UserIdType,
  ): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    return db
      .select()
      .from(Schema.entries)
      .where(
        and(
          gte(Schema.entries.startedAt, week.getStart().ms),
          lte(Schema.entries.startedAt, week.getEnd().ms),
          eq(Schema.entries.userId, userId),
        ),
      );
  }

  async getAllForUser(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    return db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });
  }

  async getByDateRangeForUser(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    return db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        eq(Schema.entries.userId, userId),
        gte(Schema.entries.startedAt, dateRange.getStart().ms),
        lte(Schema.entries.startedAt, dateRange.getEnd().ms),
      ),
    });
  }

  async getFormatted(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
    query: string,
  ): Promise<ReadonlyArray<Emotions.Ports.EntrySnapshotWithAlarms>> {
    const where = [
      eq(Schema.entries.userId, userId),
      gte(Schema.entries.startedAt, dateRange.getStart().ms),
      lte(Schema.entries.startedAt, dateRange.getEnd().ms),
    ];

    if (query !== "") {
      const pattern = `%${query}%`;

      const clauses: ReadonlyArray<SQL> = [
        Schema.entries.situationDescription,
        Schema.entries.reactionDescription,
        Schema.entries.emotionLabel,
      ].map((col) => like(col, pattern));

      const clause = or(...clauses);

      if (clause) where.push(clause);
    }

    return db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(...where),
      with: { alarms: true },
    });
  }
}

export const EntrySnapshot = new EntrySnapshotDrizzle();
