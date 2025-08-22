import { z } from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const COMPLETE_WEEKLY_REVIEW_COMMAND = "COMPLETE_WEEKLY_REVIEW_COMMAND";

export const CompleteWeeklyReviewCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(COMPLETE_WEEKLY_REVIEW_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    insights: z.instanceof(AI.Advice),
    userId: Auth.VO.UserId,
  }),
});

export type CompleteWeeklyReviewCommandType = z.infer<typeof CompleteWeeklyReviewCommand>;
