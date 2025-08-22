import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT = "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT";

export const WeeklyReviewExportByEmailRequestedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
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
