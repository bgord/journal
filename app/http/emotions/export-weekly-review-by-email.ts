import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider, Clock };

export async function ExportWeeklyReviewByEmail(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
    payload: { userId: user.id, weeklyReviewId },
  } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
