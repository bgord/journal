import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const CANCEL_ALARM_COMMAND = "CANCEL_ALARM_COMMAND";

export const CancelAlarmCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(CANCEL_ALARM_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type CancelAlarmCommandType = z.infer<typeof CancelAlarmCommand>;
