import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as wip from "+infra/build";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.DeleteEntryCommandType>;
};

export const DeleteEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = v.parse(Emotions.VO.EntryId, c.req.param("entryId"));

  const command = wip.command(
    Emotions.Commands.DeleteEntryCommand,
    { revision, payload: { entryId, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
