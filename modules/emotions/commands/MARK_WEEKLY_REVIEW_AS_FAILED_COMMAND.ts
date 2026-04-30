import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable next-line StringLiteral
export const MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND = "MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND";

export const MarkWeeklyReviewAsFailedCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND),
  payload: v.object({ weeklyReviewId: VO.WeeklyReviewId, userId: Auth.VO.UserId }),
});

export type MarkWeeklyReviewAsFailedCommandType = v.InferOutput<typeof MarkWeeklyReviewAsFailedCommand>;
