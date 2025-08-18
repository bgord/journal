import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";

export const REQUEST_ALARM_NOTIFICATION_COMMAND = "REQUEST_ALARM_NOTIFICATION_COMMAND";

export const RequestAlarmNotificationCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REQUEST_ALARM_NOTIFICATION_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type RequestAlarmNotificationCommandType = z.infer<typeof RequestAlarmNotificationCommand>;
