import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND = "SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND";
// Stryker restore all

export const ExportWeeklyReviewByEmailCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND),
  payload: v.object({ weeklyReviewId: VO.WeeklyReviewId, userId: Auth.VO.UserId }),
});

export type ExportWeeklyReviewByEmailCommandType = v.InferOutput<typeof ExportWeeklyReviewByEmailCommand>;
