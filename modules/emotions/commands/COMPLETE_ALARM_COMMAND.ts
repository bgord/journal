import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";

export const COMPLETE_ALARM_COMMAND = "COMPLETE_ALARM_COMMAND";

export const CompleteAlarmCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(COMPLETE_ALARM_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type CompleteAlarmCommandType = z.infer<typeof CompleteAlarmCommand>;
