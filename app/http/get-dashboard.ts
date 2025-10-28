import * as tools from "@bgord/tools";
import { and, desc, eq, isNull, not } from "drizzle-orm";
import type hono from "hono";
import type * as AI from "+ai";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type DashboardAlarmInactivityType = Pick<Emotions.VO.AlarmSnapshot, "id" | "advice" | "inactivityDays"> & {
  generatedAt: string;
};

export type DashboardDataType = {
  heatmap: { t: 0 | 1; c: "200" | "400" | "600" }[];
  alarms: { inactivity: DashboardAlarmInactivityType[]; entries: [] };
};

export async function GetDashboard(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const heatmapResponse = await db
    .select({ label: Schema.entries.emotionLabel, intensity: Schema.entries.emotionIntensity })
    .from(Schema.entries)
    .where(eq(Schema.entries.userId, userId))
    .orderBy(desc(Schema.entries.startedAt));

  const heatmap = heatmapResponse.map((row) => {
    const label = new Emotions.VO.EmotionLabel(row.label as Emotions.VO.EmotionLabelType);
    const intensity = new Emotions.VO.EmotionIntensity(row.intensity as Emotions.VO.EmotionIntensityType);

    return {
      t: label.isPositive() ? 1 : 0,
      c: intensity.isExtreme() ? "600" : intensity.isIntensive() ? "400" : "200",
    } as const;
  });

  const inactivityAlarmsResponse = await db.query.alarms.findMany({
    where: and(
      eq(Schema.alarms.userId, userId),
      eq(Schema.alarms.name, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM),
      not(eq(Schema.alarms.status, "cancelled")),
      not(isNull(Schema.alarms.advice)),
    ),
    orderBy: desc(Schema.alarms.generatedAt),
    limit: 5,
    columns: { id: true, generatedAt: true, advice: true, inactivityDays: true },
  });

  const inactivity = inactivityAlarmsResponse.map((alarm) => ({
    ...alarm,
    advice: alarm.advice as AI.AdviceType,
    generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
  }));

  const result: DashboardDataType = {
    heatmap,
    alarms: { inactivity, entries: [] },
  };

  return c.json(result);
}
