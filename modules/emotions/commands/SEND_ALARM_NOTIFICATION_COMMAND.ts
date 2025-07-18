import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SEND_ALARM_NOTIFICATION_COMMAND = "SEND_ALARM_NOTIFICATION_COMMAND";

export const SendAlarmNotificationCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(SEND_ALARM_NOTIFICATION_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId, trigger: Alarms.AlarmTrigger }),
});

export type SendAlarmNotificationCommandType = z.infer<typeof SendAlarmNotificationCommand>;
