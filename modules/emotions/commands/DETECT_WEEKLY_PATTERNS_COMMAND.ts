import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

// Stryker disable all
export const DETECT_WEEKLY_PATTERNS_COMMAND = "DETECT_WEEKLY_PATTERNS_COMMAND";
// Stryker restore all

export const DetectWeeklyPatternsCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DETECT_WEEKLY_PATTERNS_COMMAND),
  payload: v.object({ userId: Auth.VO.UserId, week: v.instance(tools.Week) }),
});
export type DetectWeeklyPatternsCommandType = v.InferOutput<typeof DetectWeeklyPatternsCommand>;
