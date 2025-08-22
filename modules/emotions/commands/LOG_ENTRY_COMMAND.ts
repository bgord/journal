import { z } from "zod/v4";
import * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const LOG_ENTRY_COMMAND = "LOG_ENTRY_COMMAND";

export const LogEntryCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(LOG_ENTRY_COMMAND),
  payload: z.object({
    entryId: VO.EntryId,
    situation: z.instanceof(Entities.Situation),
    emotion: z.instanceof(Entities.Emotion),
    reaction: z.instanceof(Entities.Reaction),
    language: z.enum(SupportedLanguages),
    userId: Auth.VO.UserId,
    origin: VO.EntryOrigin,
  }),
});

export type LogEntryCommandType = z.infer<typeof LogEntryCommand>;
