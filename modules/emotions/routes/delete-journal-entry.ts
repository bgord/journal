import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function DeleteJournalEntry(c: hono.Context, _next: hono.Next) {
  const emotionJournalEntryId = Emotions.VO.EntryId.parse(c.req.param("id"));

  logger.info({
    message: "Delete journal entry payload",
    operation: "read",
    metadata: { emotionJournalEntryId },
  });

  const command = Emotions.Commands.DeleteEmotionJournalEntryCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.DELETE_EMOTION_JOURNAL_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId },
  } satisfies Emotions.Commands.DeleteEmotionJournalEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
