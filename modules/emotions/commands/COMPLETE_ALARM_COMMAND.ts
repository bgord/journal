import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const COMPLETE_ALARM_COMMAND = "COMPLETE_ALARM_COMMAND";
// Stryker restore all

export const CompleteAlarmCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(COMPLETE_ALARM_COMMAND),
  payload: v.object({ alarmId: VO.AlarmId }),
});

export type CompleteAlarmCommandType = v.InferOutput<typeof CompleteAlarmCommand>;
