import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT";

export const WeeklyReviewExportByEmailFailedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT),
  payload: v.object({
    attempt: tools.IntegerPositive,
    userId: Auth.VO.UserId,
    weeklyReviewExportId: VO.WeeklyReviewExportId,
    weeklyReviewId: VO.WeeklyReviewId,
  }),
});

export type WeeklyReviewExportByEmailFailedEventType = v.InferOutput<
  typeof WeeklyReviewExportByEmailFailedEvent
>;
