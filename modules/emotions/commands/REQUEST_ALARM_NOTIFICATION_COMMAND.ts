import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const REQUEST_ALARM_NOTIFICATION_COMMAND = "REQUEST_ALARM_NOTIFICATION_COMMAND";

export const RequestAlarmNotificationCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(REQUEST_ALARM_NOTIFICATION_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type RequestAlarmNotificationCommandType = z.infer<typeof RequestAlarmNotificationCommand>;
