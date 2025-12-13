import * as tools from "@bgord/tools";
import { and, count, desc, eq, gte, isNotNull, not, sql } from "drizzle-orm";
import type hono from "hono";
import type * as AI from "+ai";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type DashboardAlarmInactivityType = Pick<Emotions.VO.AlarmSnapshot, "id" | "advice" | "inactivityDays"> & {
  generatedAt: string;
};

type DashboardAlarmEntryType = Pick<Emotions.VO.AlarmSnapshot, "id" | "advice" | "name" | "emotionLabel"> & {
  generatedAt: string;
};

type DashboardTopReactionType = Pick<
  Emotions.VO.EntrySnapshot,
  "id" | "reactionDescription" | "reactionType" | "reactionEffectiveness"
>;

type DashboardTopEmotionType = Pick<Emotions.VO.EntrySnapshot, "id" | "emotionLabel"> & { hits: number };

type DashboardWeeklyReviewType = Emotions.Queries.WeeklyReviewExportDto & {
  weekStart: string;
  weekEnd: string;
};

export type DashboardDataType = {
  heatmap: { t: 0 | 1; c: "200" | "400" | "600" }[];
  alarms: { inactivity: DashboardAlarmInactivityType[]; entry: DashboardAlarmEntryType[] };
  entries: {
    counts: { today: number; lastWeek: number; allTime: number };
    top: {
      reactions: DashboardTopReactionType[];
      emotions: {
        today: DashboardTopEmotionType[];
        lastWeek: DashboardTopEmotionType[];
        allTime: DashboardTopEmotionType[];
      };
    };
  };
  weeklyReviews: DashboardWeeklyReviewType[];
};

const deps = { Clock: Adapters.Clock, WeeklyReviewExport: Adapters.Emotions.WeeklyReviewExport };

export async function GetDashboard(c: hono.Context<infra.Config>) {
  const userId = c.get("user").id;

  const today = tools.Day.fromNow(deps.Clock.now()).getStart();
  const lastWeek = tools.Day.fromNow(deps.Clock.now()).getStart().subtract(tools.Duration.Weeks(1));
  const allTime = tools.Timestamp.fromNumber(0);

  const heatmapResponse = await db
    .select({ label: Schema.entries.emotionLabel, intensity: Schema.entries.emotionIntensity })
    .from(Schema.entries)
    .where(eq(Schema.entries.userId, userId))
    .orderBy(desc(Schema.entries.startedAt));

  const inactivityAlarmsResponse = await db.query.alarms.findMany({
    where: and(
      eq(Schema.alarms.userId, userId),
      eq(Schema.alarms.name, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM),
      not(eq(Schema.alarms.status, "cancelled")),
      isNotNull(Schema.alarms.advice),
    ),
    orderBy: desc(Schema.alarms.generatedAt),
    limit: 5,
    columns: { id: true, generatedAt: true, advice: true, inactivityDays: true },
  });

  const entryAlarmsResponse = await db.query.alarms.findMany({
    where: and(
      eq(Schema.alarms.userId, userId),
      eq(Schema.alarms.name, Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM),
      not(eq(Schema.alarms.status, "cancelled")),
      isNotNull(Schema.alarms.advice),
      isNotNull(Schema.alarms.emotionLabel),
    ),
    orderBy: desc(Schema.alarms.generatedAt),
    limit: 5,
    columns: { id: true, generatedAt: true, advice: true, emotionLabel: true, name: true },
  });

  async function getEntryCountSince(start: tools.Timestamp) {
    return db.$count(
      Schema.entries,
      and(gte(Schema.entries.startedAt, start.ms), eq(Schema.entries.userId, userId)),
    );
  }

  const [entryCountToday, entryCountLastWeek, entryCountAllTime] = await Promise.all([
    await getEntryCountSince(today),
    await getEntryCountSince(lastWeek),
    await getEntryCountSince(allTime),
  ]);

  const topReactionsResponse = await db
    .select({
      id: Schema.entries.id,
      reactionDescription: Schema.entries.reactionDescription,
      reactionType: Schema.entries.reactionType,
      reactionEffectiveness: Schema.entries.reactionEffectiveness,
    })
    .from(Schema.entries)
    .where(
      and(
        eq(Schema.entries.userId, userId),
        isNotNull(Schema.entries.reactionDescription),
        isNotNull(Schema.entries.reactionType),
        isNotNull(Schema.entries.reactionEffectiveness),
      ),
    )
    .orderBy(desc(Schema.entries.reactionEffectiveness))
    .limit(5);

  async function getTopEmotionsSince(start: tools.Timestamp) {
    const response = await db
      .select({
        id: Schema.entries.id,
        label: Schema.entries.emotionLabel,
        hits: count(Schema.entries.id).mapWith(Number),
      })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId), gte(Schema.entries.startedAt, start.ms)))
      .groupBy(Schema.entries.emotionLabel)
      .orderBy(sql`count(${Schema.entries.id}) DESC`)
      .limit(3);

    return response.map((emotion) => ({
      ...emotion,
      emotionLabel: Emotions.VO.EmotionLabelSchema.parse(emotion.label),
    }));
  }

  const [topEmotionsToday, topEmotionsLastWeek, topEmotionsAllTime] = await Promise.all([
    await getTopEmotionsSince(today),
    await getTopEmotionsSince(lastWeek),
    await getTopEmotionsSince(allTime),
  ]);

  const weeklyReviews = await deps.WeeklyReviewExport.listFull(userId, 5);

  const result: DashboardDataType = {
    heatmap: heatmapResponse.map((row) => {
      const label = new Emotions.VO.EmotionLabel(row.label as Emotions.VO.EmotionLabelType);
      const intensity = new Emotions.VO.EmotionIntensity(row.intensity as Emotions.VO.EmotionIntensityType);

      return {
        t: label.isPositive() ? 1 : 0,
        c: intensity.isExtreme() ? "600" : intensity.isIntensive() ? "400" : "200",
      } as const;
    }),
    alarms: {
      inactivity: inactivityAlarmsResponse.map((alarm) => ({
        ...alarm,
        advice: alarm.advice as AI.AdviceType,
        generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
      })),
      entry: entryAlarmsResponse.map((alarm) => ({
        ...alarm,
        advice: alarm.advice as AI.AdviceType,
        name: Emotions.VO.AlarmName.parse(alarm.name),
        emotionLabel: Emotions.VO.EmotionLabelSchema.parse(alarm.emotionLabel),
        generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
      })),
    },
    entries: {
      counts: { today: entryCountToday, lastWeek: entryCountLastWeek, allTime: entryCountAllTime },
      top: {
        reactions: topReactionsResponse.map((entry) => ({
          id: entry.id,
          reactionDescription: entry.reactionDescription as Emotions.VO.ReactionDescriptionType,
          reactionType: entry.reactionType as Emotions.VO.ReactionTypeType,
          reactionEffectiveness: entry.reactionEffectiveness as Emotions.VO.ReactionEffectivenessType,
        })),
        emotions: { today: topEmotionsToday, lastWeek: topEmotionsLastWeek, allTime: topEmotionsAllTime },
      },
    },
    weeklyReviews: weeklyReviews.map((review) => ({
      ...review,
      weekStart: tools.DateFormatters.date(tools.Week.fromIsoId(review.weekIsoId).getStart().ms),
      weekEnd: tools.DateFormatters.date(tools.Week.fromIsoId(review.weekIsoId).getEnd().ms),
    })),
  };

  return c.json(result);
}
