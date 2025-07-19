import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const GENERATE_ALARM_COMMAND = "GENERATE_ALARM_COMMAND";

export const GenerateAlarmCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(GENERATE_ALARM_COMMAND),
  payload: z.object({ detection: z.instanceof(VO.AlarmDetection), userId: Auth.VO.UserId }),
});

export type GenerateAlarmCommandType = z.infer<typeof GenerateAlarmCommand>;
