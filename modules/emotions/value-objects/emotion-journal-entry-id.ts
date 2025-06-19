import * as bg from "@bgord/bun";
import { z } from "zod/v4";

/** @public */
export const EmotionJournalEntryId = bg.UUID;
export type EmotionJournalEntryIdType = z.infer<typeof EmotionJournalEntryId>;
