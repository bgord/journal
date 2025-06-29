import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const SEND_ALARM_NOTIFICATION_COMMAND = "SEND_ALARM_NOTIFICATION_COMMAND";

export const SendAlarmNotificationCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(SEND_ALARM_NOTIFICATION_COMMAND),
  payload: z.object({
    alarmId: VO.AlarmId,
    emotionJournalEntryId: VO.EmotionJournalEntryId,
  }),
});

export type SendAlarmNotificationCommandType = z.infer<typeof SendAlarmNotificationCommand>;
