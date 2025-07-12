import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const LOG_ENTRY_COMMAND = "LOG_ENTRY_COMMAND";

export const LogEntryCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_ENTRY_COMMAND),
  payload: z.object({
    entryId: VO.EntryId,
    situation: z.instanceof(Entities.Situation),
    emotion: z.instanceof(Entities.Emotion),
    reaction: z.instanceof(Entities.Reaction),
  }),
});

export type LogEntryCommandType = z.infer<typeof LogEntryCommand>;
