import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Emotions.Commands.DeleteEntryCommandType>;
};

export const DeleteEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const command = Emotions.Commands.DeleteEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.DELETE_ENTRY_COMMAND,
    revision,
    payload: { entryId, userId },
  } satisfies Emotions.Commands.DeleteEntryCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
