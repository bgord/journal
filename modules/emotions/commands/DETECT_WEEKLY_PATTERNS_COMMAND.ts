import * as Auth from "+auth";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const DETECT_WEEKLY_PATTERNS_COMMAND = "DETECT_WEEKLY_PATTERNS_COMMAND";

export const DetectWeeklyPatternsCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(DETECT_WEEKLY_PATTERNS_COMMAND),
  payload: z.object({ userId: Auth.VO.UserId, week: z.instanceof(tools.Week) }),
});
export type DetectWeeklyPatternsCommandType = z.infer<typeof DetectWeeklyPatternsCommand>;
