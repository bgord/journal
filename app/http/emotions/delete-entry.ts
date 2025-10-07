import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function DeleteEntry(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const userId = c.get("user").id;
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const command = Emotions.Commands.DeleteEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.DELETE_ENTRY_COMMAND,
    revision,
    payload: { entryId, userId },
  } satisfies Emotions.Commands.DeleteEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
