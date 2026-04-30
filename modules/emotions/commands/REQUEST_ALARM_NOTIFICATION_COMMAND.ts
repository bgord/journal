import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+emotions/value-objects";

// Stryker disable next-line StringLiteral
export const REQUEST_ALARM_NOTIFICATION_COMMAND = "REQUEST_ALARM_NOTIFICATION_COMMAND";

export const RequestAlarmNotificationCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(REQUEST_ALARM_NOTIFICATION_COMMAND),
  payload: v.object({ alarmId: VO.AlarmId }),
});

export type RequestAlarmNotificationCommandType = v.InferOutput<typeof RequestAlarmNotificationCommand>;
