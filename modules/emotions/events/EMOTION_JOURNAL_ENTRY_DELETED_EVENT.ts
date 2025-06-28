import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const EMOTION_JOURNAL_ENTRY_DELETED_EVENT = "EMOTION_JOURNAL_ENTRY_DELETED_EVENT";

export const EmotionJournalEntryDeletedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_JOURNAL_ENTRY_DELETED_EVENT),
  version: z.literal(1),
  payload: z.object({ emotionJournalEntryId: VO.EmotionJournalEntryId }),
});

export type EmotionJournalEntryDeletedEventType = z.infer<typeof EmotionJournalEntryDeletedEvent>;
