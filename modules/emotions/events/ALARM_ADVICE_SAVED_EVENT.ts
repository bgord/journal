import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const ALARM_ADVICE_SAVED_EVENT = "ALARM_ADVICE_SAVED_EVENT";

export const AlarmAdviceSavedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_ADVICE_SAVED_EVENT),
  version: z.literal(1),
  payload: z.object({
    alarmId: VO.AlarmId,
    advice: VO.EmotionalAdviceSchema,
  }),
});

export type AlarmAdviceSavedEventType = z.infer<typeof AlarmAdviceSavedEvent>;
