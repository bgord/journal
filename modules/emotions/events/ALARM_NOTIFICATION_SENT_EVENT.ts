import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const ALARM_NOTIFICATION_SENT_EVENT = "ALARM_NOTIFICATION_SENT_EVENT";

export const AlarmNotificationSentEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_NOTIFICATION_SENT_EVENT),
  version: z.literal(1),
  payload: z.object({
    alarmId: VO.AlarmId,
    emotionJournalEntryId: VO.EmotionJournalEntryId,
  }),
});

export type AlarmNotificationSentEventType = z.infer<typeof AlarmNotificationSentEvent>;
