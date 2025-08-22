import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT";

export const WeeklyReviewExportByEmailRequestedEvent = z.object({
  ...BaseEventData,
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
