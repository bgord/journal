import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const GENERATE_ALARM_COMMAND = "GENERATE_ALARM_COMMAND";
// Stryker restore all

export const GenerateAlarmCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(GENERATE_ALARM_COMMAND),
  payload: z.object({ detection: z.instanceof(VO.AlarmDetection), userId: Auth.VO.UserId }),
});

export type GenerateAlarmCommandType = z.infer<typeof GenerateAlarmCommand>;
