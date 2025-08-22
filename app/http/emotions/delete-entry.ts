import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import { createCommandEnvelope } from "../../../base";

export async function DeleteEntry(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const command = Emotions.Commands.DeleteEntryCommand.parse({
    ...createCommandEnvelope(),
    name: Emotions.Commands.DELETE_ENTRY_COMMAND,
    revision,
    payload: { entryId, userId: user.id },
  } satisfies Emotions.Commands.DeleteEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
