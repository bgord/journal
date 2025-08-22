import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_REQUESTED_EVENT = "WEEKLY_REVIEW_REQUESTED_EVENT";

export const WeeklyReviewRequestedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(WEEKLY_REVIEW_REQUESTED_EVENT),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewRequestedEventType = z.infer<typeof WeeklyReviewRequestedEvent>;
