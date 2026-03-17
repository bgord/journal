import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const CANCEL_ALARM_COMMAND = "CANCEL_ALARM_COMMAND";
// Stryker restore all

export const CancelAlarmCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(CANCEL_ALARM_COMMAND),
  payload: v.object({ alarmId: VO.AlarmId }),
});

export type CancelAlarmCommandType = v.InferOutput<typeof CancelAlarmCommand>;
