import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const ALARM_GENERATED_EVENT = "ALARM_GENERATED_EVENT";

export const AlarmGeneratedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_GENERATED_EVENT),
  version: z.literal(1),
  payload: z.object({
    alarmId: VO.AlarmId,
    alarmName: VO.AlarmName,
    emotionJournalEntryId: VO.EmotionJournalEntryId,
  }),
});

export type AlarmGeneratedEventType = z.infer<typeof AlarmGeneratedEvent>;
