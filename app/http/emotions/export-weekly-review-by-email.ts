import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function ExportWeeklyReviewByEmail(c: hono.Context<infra.Config>) {
  const userId = c.get("user").id;
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
    payload: { userId, weeklyReviewId },
  } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
