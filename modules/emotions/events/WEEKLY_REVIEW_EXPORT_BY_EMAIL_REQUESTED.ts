import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT";

export const WeeklyReviewExportByEmailRequestedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT),
  payload: z.object({
    attempt: z.number().int(),
    userId: Auth.VO.UserId,
    weeklyReviewExportId: VO.WeeklyReviewExportId,
    weeklyReviewId: VO.WeeklyReviewId,
  }),
});

export type WeeklyReviewExportByEmailRequestedEventType = z.infer<
  typeof WeeklyReviewExportByEmailRequestedEvent
>;
