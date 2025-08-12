import * as AI from "+ai";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SAVE_ALARM_ADVICE_COMMAND = "SAVE_ALARM_ADVICE_COMMAND";

export const SaveAlarmAdviceCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(SAVE_ALARM_ADVICE_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId, advice: z.instanceof(AI.Advice) }),
});

export type SaveAlarmAdviceCommandType = z.infer<typeof SaveAlarmAdviceCommand>;
