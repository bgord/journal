import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import type * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type WeeklyReviewExportDrizzleResultType = Schema.SelectWeeklyReviews & {
  entries: Pick<Schema.SelectEntries, Emotions.Queries.WeeklyReviewExportDtoEntryFields>[];
  alarms: Pick<Schema.SelectAlarms, Emotions.Queries.WeeklyReviewExportDtoAlarmFields>[];
  patternDetections: Pick<
    Schema.SelectPatternDetections,
    Emotions.Queries.WeeklyReviewExportDtoPatternDetectionFields
  >[];
};

class WeeklyReviewExportQueryDrizzle implements Emotions.Queries.WeeklyReviewExport {
  async getFull(id: VO.WeeklyReviewIdType) {
    const result = await db.query.weeklyReviews.findFirst({
      where: eq(Schema.weeklyReviews.id, id),
      orderBy: desc(Schema.weeklyReviews.createdAt),
      with: {
        entries: {
          columns: {
            id: true,
            situationDescription: true,
            situationKind: true,
            emotionLabel: true,
            emotionIntensity: true,
            reactionDescription: true,
            reactionType: true,
            reactionEffectiveness: true,
            startedAt: true,
          },
        },
        patternDetections: {
          columns: { id: true, name: true },
          orderBy: desc(Schema.patternDetections.createdAt),
        },
        alarms: {
          columns: {
            id: true,
            name: true,
            advice: true,
            generatedAt: true,
            inactivityDays: true,
            lastEntryTimestamp: true,
            emotionLabel: true,
            emotionIntensity: true,
          },
          orderBy: desc(Schema.alarms.generatedAt),
        },
      },
    });

    if (!result) return undefined;
    return WeeklyReviewExportQueryDrizzle.format(result);
  }

  async listFull(userId: Auth.VO.UserIdType, limit: tools.IntegerPositiveType) {
    const weeklyReviews = await db.query.weeklyReviews.findMany({
      where: eq(Schema.weeklyReviews.userId, userId),
      orderBy: desc(Schema.weeklyReviews.createdAt),
      with: {
        entries: {
          columns: {
            id: true,
            situationDescription: true,
            situationKind: true,
            emotionLabel: true,
            emotionIntensity: true,
            reactionDescription: true,
            reactionType: true,
            reactionEffectiveness: true,
            startedAt: true,
          },
        },
        patternDetections: {
          columns: { id: true, name: true },
          orderBy: desc(Schema.patternDetections.createdAt),
        },
        alarms: {
          columns: {
            id: true,
            name: true,
            advice: true,
            generatedAt: true,
            inactivityDays: true,
            lastEntryTimestamp: true,
            emotionLabel: true,
            emotionIntensity: true,
          },
          orderBy: desc(Schema.alarms.generatedAt),
        },
      },
      limit,
    });

    return weeklyReviews.map((result) => WeeklyReviewExportQueryDrizzle.format(result));
  }

  static format(result: WeeklyReviewExportDrizzleResultType) {
    return {
      ...result,
      createdAt: tools.TimestampValue.parse(result.createdAt),
      status: result.status as VO.WeeklyReviewStatusEnum,
      weekIsoId: tools.WeekIsoId.parse(result.weekIsoId),
      entries: result.entries.map((entry) => ({
        ...entry,
        startedAt: tools.TimestampValue.parse(entry.startedAt),
        situationKind: entry.situationKind as VO.SituationKindOptions,
        emotionLabel: entry.emotionLabel as VO.GenevaWheelEmotion | null,
        reactionType: entry.reactionType as VO.GrossEmotionRegulationStrategy | null,
      })),
      patternDetections: result.patternDetections.map((pattern) => ({
        id: pattern.id,
        name: pattern.name as VO.PatternNameOption,
      })),
      alarms: result.alarms.map((alarm) => ({
        ...alarm,
        inactivityDays: alarm.inactivityDays ? tools.IntegerPositive.parse(alarm.inactivityDays) : null,
        name: alarm.name as VO.AlarmNameOption,
        advice: alarm.advice as VO.AlarmSnapshot["advice"],
        generatedAt: tools.TimestampValue.parse(alarm.generatedAt),
        lastEntryTimestamp: alarm.lastEntryTimestamp as tools.TimestampValueType | null,
        emotionLabel: alarm.emotionLabel as VO.GenevaWheelEmotion | null,
      })),
    };
  }
}

export const WeeklyReviewExportQuery = new WeeklyReviewExportQueryDrizzle();
