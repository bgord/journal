import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const CANCEL_ALARM_COMMAND = "CANCEL_ALARM_COMMAND";

export const CancelAlarmCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(CANCEL_ALARM_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type CancelAlarmCommandType = z.infer<typeof CancelAlarmCommand>;
