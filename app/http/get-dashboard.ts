import * as tools from "@bgord/tools";
import { and, desc, eq, gte, isNotNull, lte, not } from "drizzle-orm";
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

type DashboardTopReactionsType = Pick<
  Emotions.VO.EntrySnapshot,
  "id" | "reactionDescription" | "reactionType" | "reactionEffectiveness"
>;

export type DashboardDataType = {
  heatmap: { t: 0 | 1; c: "200" | "400" | "600" }[];
  alarms: { inactivity: DashboardAlarmInactivityType[]; entry: DashboardAlarmEntryType[] };
  entries: {
    counts: { today: number; lastWeek: number; allTime: number };
    top: { reactions: DashboardTopReactionsType[] };
  };
};

const deps = { Clock: Adapters.Clock };

export async function GetDashboard(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

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

  const entryCountToday = await db.$count(
    Schema.entries,
    and(
      gte(Schema.entries.startedAt, tools.Day.fromNow(deps.Clock.nowMs()).getStart()),
      lte(Schema.entries.startedAt, deps.Clock.nowMs()),
      eq(Schema.entries.userId, userId),
    ),
  );

  const entryCountLastWeek = await db.$count(
    Schema.entries,
    and(
      gte(Schema.entries.startedAt, deps.Clock.nowMs() - tools.Duration.Weeks(1).ms),
      lte(Schema.entries.startedAt, deps.Clock.nowMs()),
      eq(Schema.entries.userId, userId),
    ),
  );

  const entryCountAllTime = await db.$count(
    Schema.entries,
    and(
      gte(Schema.entries.startedAt, 0),
      lte(Schema.entries.startedAt, deps.Clock.nowMs()),
      eq(Schema.entries.userId, userId),
    ),
  );

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
      },
    },
  };

  return c.json(result);
}
