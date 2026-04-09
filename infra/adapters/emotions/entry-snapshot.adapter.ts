import * as tools from "@bgord/tools";
import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { AlarmDirectoryDrizzle } from "./alarm-directory.adapter";

class EntrySnapshotDrizzle implements Emotions.Ports.EntrySnapshotPort {
  async getById(entryId: Emotions.VO.EntryIdType): Promise<Emotions.VO.EntrySnapshot | undefined> {
    const entry = await db.query.entries.findFirst({
      where: eq(Schema.entries.id, entryId),
    });

    if (!entry) return undefined;

    return {
      ...entry,
      weekIsoId: v.parse(tools.WeekIsoId, entry.weekIsoId),
      startedAt: v.parse(tools.TimestampValue, entry.startedAt),
      status: entry.status as Emotions.VO.EntryStatusEnum,
      situationKind: entry.situationKind as Emotions.VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as Emotions.VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as Emotions.VO.GrossEmotionRegulationStrategy | null,
      origin: entry.origin as Emotions.VO.EntryOriginOption,
    };
  }

  async getByWeekForUser(
    week: tools.Week,
    userId: Auth.VO.UserIdType,
  ): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    const entries = await db
      .select()
      .from(Schema.entries)
      .where(
        and(
          gte(Schema.entries.startedAt, week.getStart().ms),
          lte(Schema.entries.startedAt, week.getEnd().ms),
          eq(Schema.entries.userId, userId),
        ),
      );

    return entries.map(EntrySnapshotDrizzle.format);
  }

  async getAllForUser(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });

    return entries.map(EntrySnapshotDrizzle.format);
  }

  async getByDateRangeForUser(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<Emotions.VO.EntrySnapshot>> {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        eq(Schema.entries.userId, userId),
        gte(Schema.entries.startedAt, dateRange.getStart().ms),
        lte(Schema.entries.startedAt, dateRange.getEnd().ms),
      ),
    });

    return entries.map(EntrySnapshotDrizzle.format);
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

      where.push(or(...clauses) as SQL<unknown>);
    }

    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(...where),
      with: { alarms: true },
    });

    return entries.map((entry) => ({
      ...EntrySnapshotDrizzle.format(entry),
      alarms: entry.alarms.map(AlarmDirectoryDrizzle.format),
    }));
  }

  static format(entry: Schema.SelectEntries) {
    return {
      ...entry,
      startedAt: v.parse(tools.TimestampValue, entry.startedAt),
      status: entry.status as Emotions.VO.EntryStatusEnum,
      situationKind: entry.situationKind as Emotions.VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as Emotions.VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as Emotions.VO.GrossEmotionRegulationStrategy | null,
      origin: entry.origin as Emotions.VO.EntryOriginOption,
      weekIsoId: v.parse(tools.WeekIsoId, entry.weekIsoId),
    };
  }
}

export const EntrySnapshot = new EntrySnapshotDrizzle();
