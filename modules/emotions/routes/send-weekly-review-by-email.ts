import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function SendWeeklyReviewByEmail(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  console.log(user, weeklyReviewId);

  return new Response();
}
