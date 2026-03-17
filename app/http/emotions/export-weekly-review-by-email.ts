import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.ExportWeeklyReviewByEmailCommandType>;
};

export const ExportWeeklyReviewByEmail = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const weeklyReviewId = v.parse(Emotions.VO.WeeklyReviewId, c.req.param("weeklyReviewId"));

  const command = bg.command(
    Emotions.Commands.ExportWeeklyReviewByEmailCommand,
    { payload: { userId, weeklyReviewId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
