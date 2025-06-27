import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const LOG_SITUATION_COMMAND = "LOG_SITUATION_COMMAND";

export const LogSituationCommand = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_SITUATION_COMMAND),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
  }),
});

export type LogSituationCommandType = z.infer<typeof LogSituationCommand>;
