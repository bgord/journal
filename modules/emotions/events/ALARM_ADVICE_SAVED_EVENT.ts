import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_ADVICE_SAVED_EVENT = "ALARM_ADVICE_SAVED_EVENT";

export const AlarmAdviceSavedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(ALARM_ADVICE_SAVED_EVENT),
  payload: z.object({ alarmId: VO.AlarmId, advice: AI.AdviceSchema, userId: Auth.VO.UserId }),
});

export type AlarmAdviceSavedEventType = z.infer<typeof AlarmAdviceSavedEvent>;
