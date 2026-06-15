import * as tools from "@bgord/tools";
import { and, count, desc, eq, gte, isNotNull, not, sql } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class DashboardQueryDrizzle implements Emotions.Queries.Dashboard {
  async get(userId: Auth.VO.UserIdType, now: tools.Timestamp): Promise<Emotions.Queries.DashboardDto> {
    const today = tools.Day.fromNow(now).getStart();
    const lastWeek = tools.Day.fromNow(now).getStart().subtract(tools.Duration.Weeks(1));
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
        hits: tools.Int.nonNegative(emotion.hits),
        emotionLabel: emotion.label as Emotions.VO.GenevaWheelEmotion,
      }));
    }

    const [topEmotionsToday, topEmotionsLastWeek, topEmotionsAllTime] = await Promise.all([
      await getTopEmotionsSince(today),
      await getTopEmotionsSince(lastWeek),
      await getTopEmotionsSince(allTime),
    ]);

    return {
      heatmap: heatmapResponse.map((row) => ({
        emotionLabel: row.label as Emotions.VO.GenevaWheelEmotion,
        emotionIntensity: row.intensity as Emotions.VO.EmotionIntensityType,
      })),
      alarms: {
        inactivity: inactivityAlarmsResponse.map((alarm) => ({
          ...alarm,
          generatedAt: v.parse(tools.TimestampValue, alarm.generatedAt),
          inactivityDays: alarm.inactivityDays ? tools.Int.positive(alarm.inactivityDays) : null,
          advice: alarm.advice as Emotions.VO.AlarmSnapshot["advice"],
        })),
        entry: entryAlarmsResponse.map((alarm) => ({
          ...alarm,
          generatedAt: v.parse(tools.TimestampValue, alarm.generatedAt),
          emotionLabel: alarm.emotionLabel as Emotions.VO.GenevaWheelEmotion,
          name: alarm.name as Emotions.VO.AlarmNameOption,
          advice: alarm.advice as Emotions.VO.AlarmSnapshot["advice"],
        })),
      },
      entries: {
        counts: {
          today: tools.Int.nonNegative(entryCountToday),
          lastWeek: tools.Int.nonNegative(entryCountLastWeek),
          allTime: tools.Int.nonNegative(entryCountAllTime),
        },
        top: {
          reactions: topReactionsResponse.map((entry) => ({
            id: entry.id,
            reactionDescription: entry.reactionDescription as Emotions.VO.ReactionDescriptionType,
            reactionType: entry.reactionType as Emotions.VO.ReactionTypeType,
            reactionEffectiveness: entry.reactionEffectiveness as Emotions.VO.ReactionEffectivenessType,
          })),
          emotions: {
            today: topEmotionsToday,
            lastWeek: topEmotionsLastWeek,
            allTime: topEmotionsAllTime,
          },
        },
      },
    };
  }
}

export const DashboardQuery = new DashboardQueryDrizzle();
