import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

// Stryker disable all
export const DETECT_WEEKLY_PATTERNS_COMMAND = "DETECT_WEEKLY_PATTERNS_COMMAND";
// Stryker restore all

export const DetectWeeklyPatternsCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(DETECT_WEEKLY_PATTERNS_COMMAND),
  payload: z.object({ userId: Auth.VO.UserId, week: z.instanceof(tools.Week) }),
});
export type DetectWeeklyPatternsCommandType = z.infer<typeof DetectWeeklyPatternsCommand>;
