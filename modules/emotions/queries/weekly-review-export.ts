import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export type WeeklyReviewExportDto = VO.WeeklyReviewSnapshot & {
  entries: Pick<
    VO.EntrySnapshot,
    | "id"
    | "situationDescription"
    | "situationLocation"
    | "situationKind"
    | "emotionLabel"
    | "emotionIntensity"
    | "reactionDescription"
    | "reactionType"
    | "reactionEffectiveness"
    | "startedAt"
  >[];
  patternDetections: Pick<VO.PatternDetectionSnapshot, "id" | "name">[];
  alarms: Pick<
    VO.AlarmSnapshot,
    | "id"
    | "name"
    | "advice"
    | "generatedAt"
    | "inactivityDays"
    | "lastEntryTimestamp"
    | "emotionLabel"
    | "emotionIntensity"
  >[];
};

export class WeeklyReviewExport {
  static async getFull(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewExportDto | undefined> {
    const result = await db.query.weeklyReviews.findFirst({
      where: eq(Schema.weeklyReviews.id, id),
      orderBy: desc(Schema.weeklyReviews.createdAt),
      with: {
        entries: {
          columns: {
            id: true,
            situationDescription: true,
            situationLocation: true,
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
    return {
      ...result,
      createdAt: result.createdAt as tools.TimestampType,
      status: result.status as VO.WeeklyReviewStatusEnum,
      entries: result.entries.map((entry) => ({
        ...entry,
        startedAt: tools.Timestamp.parse(entry.startedAt),
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
        name: alarm.name as VO.AlarmNameOption,
        advice: alarm.advice as VO.AlarmSnapshot["advice"],
        generatedAt: alarm.generatedAt as tools.TimestampType,
        lastEntryTimestamp: alarm.lastEntryTimestamp as tools.TimestampType | null,
        emotionLabel: alarm.emotionLabel as VO.GenevaWheelEmotion | null,
      })),
    };
  }
}
