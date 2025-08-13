import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND = "MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND";

export const MarkWeeklyReviewAsFailedCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    userId: Auth.VO.UserId,
  }),
});

export type MarkWeeklyReviewAsFailedCommandType = z.infer<typeof MarkWeeklyReviewAsFailedCommand>;
