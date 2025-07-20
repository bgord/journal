import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function DashboardStats(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const alarms = await Emotions.Repos.AlarmRepository.list(user.id);
  const entryCounts = await Emotions.Repos.EntryRepository.getCounts(user.id);
  const entryTopEmotions = await Emotions.Repos.EntryRepository.getTopEmotions(user.id);
  const topReactions = await Emotions.Repos.EntryRepository.topFiveEffective(user.id);

  return c.json({
    alarms,
    entries: { counts: entryCounts, topEmotions: entryTopEmotions, topReactions },
  });
}
