import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT";

export const WeeklyReviewExportByEmailRequestedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT),
  payload: v.object({
    attempt: tools.IntegerPositive,
    userId: Auth.VO.UserId,
    weeklyReviewExportId: VO.WeeklyReviewExportId,
    weeklyReviewId: VO.WeeklyReviewId,
  }),
});

export type WeeklyReviewExportByEmailRequestedEventType = v.InferOutput<
  typeof WeeklyReviewExportByEmailRequestedEvent
>;
