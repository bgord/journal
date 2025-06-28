import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function DeleteJournalEntry(c: hono.Context, _next: hono.Next) {
  const emotionJournalEntryId = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  infra.logger.info({
    message: "Delete journal entry payload",
    operation: "read",
    metadata: { emotionJournalEntryId },
  });

  const command = Emotions.Commands.DeleteEmotionJournalEntryCommand.parse({
    id: bg.NewUUID.generate(),
    name: Emotions.Commands.DELETE_EMOTION_JOURNAL_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId },
  } satisfies Emotions.Commands.DeleteEmotionJournalEntryCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
