import type * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import type * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type WeeklyReviewExportDrizzleResultType = Schema.SelectWeeklyReviews & {
  entries: ReadonlyArray<Pick<Schema.SelectEntries, Emotions.Queries.WeeklyReviewExportDtoEntryFields>>;
  alarms: ReadonlyArray<Pick<Schema.SelectAlarms, Emotions.Queries.WeeklyReviewExportDtoAlarmFields>>;
  patternDetections: ReadonlyArray<
    Pick<Schema.SelectPatternDetections, Emotions.Queries.WeeklyReviewExportDtoPatternDetectionFields>
  >;
};

class WeeklyReviewExportQueryDrizzle implements Emotions.Queries.WeeklyReviewExport {
  async getFull(id: VO.WeeklyReviewIdType): Promise<Emotions.Queries.WeeklyReviewExportDto | undefined> {
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
    return result;
  }
}

export const WeeklyReviewExportQuery = new WeeklyReviewExportQueryDrizzle();
