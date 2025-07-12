import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function DeleteEntry(c: hono.Context, _next: hono.Next) {
  const entryId = Emotions.VO.EntryId.parse(c.req.param("id"));

  logger.info({
    message: "Delete entry payload",
    operation: "read",
    metadata: { entryId },
  });

  const command = Emotions.Commands.DeleteEntryCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.DELETE_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { entryId },
  } satisfies Emotions.Commands.DeleteEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
