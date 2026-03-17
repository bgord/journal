import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as AI from "+ai";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const SAVE_ALARM_ADVICE_COMMAND = "SAVE_ALARM_ADVICE_COMMAND";
// Stryker restore all

export const SaveAlarmAdviceCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(SAVE_ALARM_ADVICE_COMMAND),
  payload: v.object({ alarmId: VO.AlarmId, advice: v.instance(AI.Advice) }),
});

export type SaveAlarmAdviceCommandType = v.InferOutput<typeof SaveAlarmAdviceCommand>;
