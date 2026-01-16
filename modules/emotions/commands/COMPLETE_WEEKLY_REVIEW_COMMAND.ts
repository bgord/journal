import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const COMPLETE_WEEKLY_REVIEW_COMMAND = "COMPLETE_WEEKLY_REVIEW_COMMAND";
// Stryker restore all

export const CompleteWeeklyReviewCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(COMPLETE_WEEKLY_REVIEW_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    insights: z.instanceof(AI.Advice),
    userId: Auth.VO.UserId,
  }),
});

export type CompleteWeeklyReviewCommandType = z.infer<typeof CompleteWeeklyReviewCommand>;
