import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const CANCEL_ALARM_COMMAND = "CANCEL_ALARM_COMMAND";
// Stryker restore all

export const CancelAlarmCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(CANCEL_ALARM_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type CancelAlarmCommandType = z.infer<typeof CancelAlarmCommand>;
