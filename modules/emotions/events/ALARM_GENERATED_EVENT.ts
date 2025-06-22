import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const ALARM_GENERATED_EVENT = "ALARM_GENERATED_EVENT";

export const AlarmGeneratedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_GENERATED_EVENT),
  version: z.literal(1),
  payload: z.object({
    entryId: VO.EmotionJournalEntryId,
    alarmName: VO.AlarmNameOption,
  }),
});

export type AlarmGeneratedEventType = z.infer<typeof AlarmGeneratedEvent>;
