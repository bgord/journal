import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const WEEKLY_REVIEW_FAILED_EVENT = "WEEKLY_REVIEW_FAILED_EVENT";

export const WeeklyReviewFailedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(WEEKLY_REVIEW_FAILED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue,
  payload: z.object({ weeklyReviewId: VO.WeeklyReviewId, weekStartedAt: tools.Timestamp }),
});

export type WeeklyReviewFailedEventType = z.infer<typeof WeeklyReviewFailedEvent>;
