import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable next-line StringLiteral
export const GENERATE_ALARM_COMMAND = "GENERATE_ALARM_COMMAND";

export const GenerateAlarmCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(GENERATE_ALARM_COMMAND),
  payload: v.object({ detection: v.instance(VO.AlarmDetection), userId: Auth.VO.UserId }),
});

export type GenerateAlarmCommandType = v.InferOutput<typeof GenerateAlarmCommand>;
