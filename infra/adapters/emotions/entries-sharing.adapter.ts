import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class EntriesSharingOHQDrizzle implements Emotions.OHQ.EntriesSharingPort {
  async listForOwnerInRange(ownerId: Auth.VO.UserIdType, dateRange: tools.DateRange) {
    const result = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        gte(Schema.entries.startedAt, dateRange.getStart().ms),
        lte(Schema.entries.startedAt, dateRange.getEnd().ms),
        eq(Schema.entries.userId, ownerId),
      ),
      with: { alarms: true },
    });

    return result.map((entry) => ({
      ...entry,
      startedAt: tools.DateFormatters.datetime(entry.startedAt),
      status: entry.status as Emotions.VO.EntryStatusEnum,
      situationKind: entry.situationKind as Emotions.VO.SituationKindOptions,
      emotionLabel: entry.emotionLabel as Emotions.VO.GenevaWheelEmotion | null,
      reactionType: entry.reactionType as Emotions.VO.GrossEmotionRegulationStrategy | null,
      origin: entry.origin as Emotions.VO.EntryOriginOption,
      weekIsoId: tools.WeekIsoId.parse(entry.weekIsoId),
      alarms: entry.alarms.map((alarm) => ({
        ...alarm,
        entryId: alarm.entryId as bg.UUIDType,
        status: alarm.status as Emotions.VO.AlarmStatusEnum,
        name: alarm.name as Emotions.VO.AlarmNameOption,
        advice: alarm.advice as Emotions.VO.AlarmSnapshot["advice"],
        generatedAt: alarm.generatedAt as tools.TimestampValueType,
        lastEntryTimestamp: alarm.lastEntryTimestamp as tools.TimestampValueType | null,
        emotionLabel: alarm.emotionLabel as Emotions.VO.GenevaWheelEmotion | null,
        weekIsoId: tools.WeekIsoId.parse(alarm.weekIsoId),
      })),
    }));
  }
}

export const EntriesSharingOHQ = new EntriesSharingOHQDrizzle();
