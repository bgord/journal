import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

// Stryker disable next-line StringLiteral
export const SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND = "SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND";

export const ScheduleTimeCapsuleEntryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND),
  payload: v.object({
    entryId: VO.EntryId,
    situation: v.instance(Entities.Situation),
    emotion: v.instance(Entities.Emotion),
    reaction: v.instance(Entities.Reaction),
    userId: Auth.VO.UserId,
    scheduledAt: tools.TimestampValue,
    scheduledFor: tools.TimestampValue,
  }),
});

export type ScheduleTimeCapsuleEntryCommandType = v.InferOutput<typeof ScheduleTimeCapsuleEntryCommand>;
