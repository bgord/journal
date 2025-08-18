import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import type { EntrySnapshotPort } from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class EntrySnapshotDrizzle implements EntrySnapshotPort {
  async getById(entryId: VO.EntryIdType) {
    const entry = await db.query.entries.findFirst({
      where: eq(Schema.entries.id, entryId),
    });

    if (!entry) return undefined;

    return {
      ...entry,
      startedAt: tools.Timestamp.parse(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      language: entry.language as SupportedLanguages,
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

    return entries.map((entry) => ({
      ...entry,
      startedAt: tools.Timestamp.parse(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      language: entry.language as SupportedLanguages,
      origin: entry.origin as VO.EntryOriginOption,
    }));
  }

  async getAllForuser(userId: Auth.VO.UserIdType) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });

    return entries.map((entry) => ({
      ...entry,
      startedAt: tools.Timestamp.parse(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      language: entry.language as SupportedLanguages,
      origin: entry.origin as VO.EntryOriginOption,
    }));
  }
}

export const EntrySnapshot = new EntrySnapshotDrizzle();
