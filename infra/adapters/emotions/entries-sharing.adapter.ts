import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import type { EntriesSharingPort } from "+emotions/open-host-queries";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class EntriesSharingDrizzle implements EntriesSharingPort {
  async listForOwnerInRange(ownerId: Auth.VO.UserIdType, dateRange: tools.DateRange) {
    const result = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        gte(Schema.entries.startedAt, dateRange.getStart()),
        lte(Schema.entries.startedAt, dateRange.getEnd()),
        eq(Schema.entries.userId, ownerId),
      ),
      with: { alarms: true },
    });

    return result.map((entry) => ({
      ...entry,
      startedAt: tools.DateFormatters.datetime(entry.startedAt),
      status: entry.status as VO.EntryStatusEnum,
      situationKind: entry.situationKind as VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      language: entry.language as SupportedLanguages,
      origin: entry.origin as VO.EntryOriginOption,
      alarms: entry.alarms.map((alarm) => ({
        ...alarm,
        entryId: alarm.entryId as bg.UUIDType,
        status: alarm.status as VO.AlarmStatusEnum,
        name: alarm.name as VO.AlarmNameOption,
        advice: alarm.advice as VO.AlarmSnapshot["advice"],
        generatedAt: alarm.generatedAt as tools.TimestampType,
        lastEntryTimestamp: alarm.lastEntryTimestamp as tools.TimestampType | null,
        emotionLabel: alarm.emotionLabel as VO.GenevaWheelEmotion | null,
      })),
    }));
  }
}

export const EntriesSharing = new EntriesSharingDrizzle();
