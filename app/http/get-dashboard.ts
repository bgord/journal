import { desc, eq } from "drizzle-orm";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export type DashboardDataType = {
  heatmap: { t: 0 | 1; c: "200" | "400" | "600" }[];
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

  const result: DashboardDataType = { heatmap };

  return c.json(result);
}
