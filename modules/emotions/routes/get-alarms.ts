import hono from "hono";
import * as Emotions from "../";

export async function GetAlarms(c: hono.Context, _next: hono.Next) {
  const alarms = await Emotions.Repos.AlarmRepository.getAlarms();

  return c.json(alarms);
}
