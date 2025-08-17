import { desc, eq } from "drizzle-orm";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export type WeeklyReviewExportDto = Schema.SelectWeeklyReviews & {
  // TODO
  entries: Pick<
    Schema.SelectEntries,
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
  patternDetections: Pick<Schema.SelectPatternDetections, "id" | "name">[];
  alarms: Pick<
    Schema.SelectAlarms,
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

export class WeeklyReviewExportReadModel {
  static async getFull(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewExportDto | undefined> {
    return db.query.weeklyReviews.findFirst({
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
  }
}
