import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as AI from "+ai";
import * as VO from "+emotions/value-objects";

export const SAVE_ALARM_ADVICE_COMMAND = "SAVE_ALARM_ADVICE_COMMAND";

export const SaveAlarmAdviceCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(SAVE_ALARM_ADVICE_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId, advice: z.instanceof(AI.Advice) }),
});

export type SaveAlarmAdviceCommandType = z.infer<typeof SaveAlarmAdviceCommand>;
