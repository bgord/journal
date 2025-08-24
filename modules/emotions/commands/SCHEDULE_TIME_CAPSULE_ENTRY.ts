import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

export const SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND = "SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND";

export const ScheduleTimeCapsuleEntryCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND),
  payload: z.object({
    entryId: VO.EntryId,
    situation: z.instanceof(Entities.Situation),
    emotion: z.instanceof(Entities.Emotion),
    reaction: z.instanceof(Entities.Reaction),
    userId: Auth.VO.UserId,
    scheduledAt: tools.Timestamp,
    scheduledFor: tools.Timestamp,
  }),
});

export type ScheduleTimeCapsuleEntryCommandType = z.infer<typeof ScheduleTimeCapsuleEntryCommand>;
