import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT";

export const WeeklyReviewExportByEmailFailedEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT),
  payload: z.object({
    attempt: z.number().int(),
    userId: Auth.VO.UserId,
    weeklyReviewExportId: VO.WeeklyReviewExportId,
    weeklyReviewId: VO.WeeklyReviewId,
  }),
});

export type WeeklyReviewExportByEmailFailedEventType = z.infer<typeof WeeklyReviewExportByEmailFailedEvent>;
