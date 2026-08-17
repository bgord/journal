import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.DeleteEntryCommandType>;
};

export const DeleteEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const userId = context.identity.userId() as bg.UUIDType;
  const entryId = v.parse(Emotions.VO.EntryId, params["entryId"]);

  const command = bg.command(
    Emotions.Commands.DeleteEntryCommand,
    { revision: context.middleware.revision.fromWeakETag(), payload: { entryId, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
