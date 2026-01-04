import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const REQUEST_ALARM_NOTIFICATION_COMMAND = "REQUEST_ALARM_NOTIFICATION_COMMAND";
// Stryker restore all

export const RequestAlarmNotificationCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(REQUEST_ALARM_NOTIFICATION_COMMAND),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type RequestAlarmNotificationCommandType = z.infer<typeof RequestAlarmNotificationCommand>;
