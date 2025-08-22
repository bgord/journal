import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND = "MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND";

export const MarkWeeklyReviewAsFailedCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    userId: Auth.VO.UserId,
  }),
});

export type MarkWeeklyReviewAsFailedCommandType = z.infer<typeof MarkWeeklyReviewAsFailedCommand>;
