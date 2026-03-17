import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const COMPLETE_WEEKLY_REVIEW_COMMAND = "COMPLETE_WEEKLY_REVIEW_COMMAND";
// Stryker restore all

export const CompleteWeeklyReviewCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(COMPLETE_WEEKLY_REVIEW_COMMAND),
  payload: v.object({
    weeklyReviewId: VO.WeeklyReviewId,
    insights: v.instance(AI.Advice),
    userId: Auth.VO.UserId,
  }),
});

export type CompleteWeeklyReviewCommandType = v.InferOutput<typeof CompleteWeeklyReviewCommand>;
