import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const LOG_ENTRY_COMMAND = "LOG_ENTRY_COMMAND";
// Stryker restore all

export const LogEntryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(LOG_ENTRY_COMMAND),
  payload: v.object({
    entryId: VO.EntryId,
    situation: v.instance(Entities.Situation),
    emotion: v.instance(Entities.Emotion),
    reaction: v.instance(Entities.Reaction),
    userId: Auth.VO.UserId,
    origin: VO.EntryOrigin,
  }),
});

export type LogEntryCommandType = v.InferOutput<typeof LogEntryCommand>;
