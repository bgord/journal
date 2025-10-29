import * as tools from "@bgord/tools";
import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import type * as Auth from "+auth";
import type { EntrySnapshotPort } from "+emotions/ports";
import type * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { AlarmDirectoryDrizzle } from "./alarm-directory.adapter";

class EntrySnapshotDrizzle implements EntrySnapshotPort {
  async getById(entryId: VO.EntryIdType) {
    const entry = await db.query.entries.findFirst({
      where: eq(Schema.entries.id, entryId),
    });

    if (!entry) return undefined;

    return {
      ...entry,
      weekIsoId: tools.WeekIsoId.parse(entry.weekIsoId),
      startedAt: tools.Timestamp.parse(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      origin: entry.origin as VO.EntryOriginOption,
    };
  }

  async getByWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType) {
    const entries = await db
      .select()
      .from(Schema.entries)
      .where(
        and(
          gte(Schema.entries.startedAt, week.getStart()),
          lte(Schema.entries.startedAt, week.getEnd()),
          eq(Schema.entries.userId, userId),
        ),
      );

    return entries.map(EntrySnapshotDrizzle.format);
  }

  async getAllForuser(userId: Auth.VO.UserIdType) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });

    return entries.map(EntrySnapshotDrizzle.format);
  }

  async getByDateRangeForUser(userId: Auth.VO.UserIdType, dateRange: tools.DateRange) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        eq(Schema.entries.userId, userId),
        gte(Schema.entries.startedAt, dateRange.getStart()),
        lte(Schema.entries.startedAt, dateRange.getEnd()),
      ),
    });

    return entries.map(EntrySnapshotDrizzle.format);
  }

  async getByDateRangeForUserWithAlarms(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
    query: string,
  ) {
    const where = [
      eq(Schema.entries.userId, userId),
      gte(Schema.entries.startedAt, dateRange.getStart()),
      lte(Schema.entries.startedAt, dateRange.getEnd()),
    ];

    if (query !== "") {
      const pattern = `%${query}%`;

      const clauses: SQL[] = [
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
      startedAt: tools.Timestamp.parse(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      origin: entry.origin as VO.EntryOriginOption,
      weekIsoId: tools.WeekIsoId.parse(entry.weekIsoId),
    };
  }
}

export const EntrySnapshot = new EntrySnapshotDrizzle();
