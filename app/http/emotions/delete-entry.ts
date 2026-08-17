import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.DeleteEntryCommandType>;
};

export const DeleteEntry = (deps: Dependencies):bg.EndpointPort => async (context) => {
  const params = context.request.params();

  const userId = context.identity.authenticatedUserId();
  const entryId = v.parse(Emotions.VO.EntryId, params["entryId"]);

  const command = bg.command(
    Emotions.Commands.DeleteEntryCommand,
    { revision: context.middleware.revision.fromWeakETag(), payload: { entryId, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
