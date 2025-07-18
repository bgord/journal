import * as Auth from "+auth";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const ALARM_ADVICE_SAVED_EVENT = "ALARM_ADVICE_SAVED_EVENT";

export const AlarmAdviceSavedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_ADVICE_SAVED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    alarmId: VO.AlarmId,
    advice: VO.EmotionalAdviceSchema,
    trigger: Alarms.AlarmTrigger,
    userId: Auth.VO.UserId,
  }),
});

export type AlarmAdviceSavedEventType = z.infer<typeof AlarmAdviceSavedEvent>;
