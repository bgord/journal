import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND = "MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND";
// Stryker restore all

export const MarkWeeklyReviewAsFailedCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND),
  payload: z.object({ weeklyReviewId: VO.WeeklyReviewId, userId: Auth.VO.UserId }),
});

export type MarkWeeklyReviewAsFailedCommandType = z.infer<typeof MarkWeeklyReviewAsFailedCommand>;
