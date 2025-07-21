// modules/emotions/delete-entry.domain.ts
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Validated } from "../../../adapter";
import { appContract } from "../../../contract";

export async function DeleteEntry(
  { params }: Validated<typeof appContract.emotions.deleteEntry>,
  c: Parameters<import("hono").Handler<infra.HonoConfig>>[0],
) {
  const user = c.get("user");
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = Emotions.Commands.DeleteEntryCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.DELETE_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    revision,
    payload: { entryId: params.entryId, userId: user.id },
  } satisfies Emotions.Commands.DeleteEntryCommandType);

  await CommandBus.emit(command.name, command);
  return c.body(null, 204);
}
