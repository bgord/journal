import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function ExportWeeklyReviewByEmail(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { userId: user.id, weeklyReviewId },
  } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommand);

  await CommandBus.emit(command.name, command);

  return new Response();
}
