import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.ExportWeeklyReviewByEmailCommandType>;
};

export const ExportWeeklyReviewByEmail = (deps: Dependencies):bg.EndpointPort => async (context) => {
  const params = context.request.params();

  const userId = context.identity.userId() as bg.UUIDType;
  const weeklyReviewId = v.parse(Emotions.VO.WeeklyReviewId, params["weeklyReviewId"]);

  const command = bg.command(
    Emotions.Commands.ExportWeeklyReviewByEmailCommand,
    { payload: { userId, weeklyReviewId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
