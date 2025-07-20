import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function DashboardStats(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  const alarms = await Emotions.Repos.AlarmRepository.list(user.id);

  return c.json({ alarms });
}
