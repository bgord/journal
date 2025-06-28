import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const DELETE_EMOTION_JOURNAL_ENTRY_COMMAND = "DELETE_EMOTION_JOURNAL_ENTRY_COMMAND";

export const DeleteEmotionJournalEntryCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(DELETE_EMOTION_JOURNAL_ENTRY_COMMAND),
  payload: z.object({ emotionJournalEntryId: VO.EmotionJournalEntryId }),
});

export type DeleteEmotionJournalEntryCommandType = z.infer<typeof DeleteEmotionJournalEntryCommand>;
