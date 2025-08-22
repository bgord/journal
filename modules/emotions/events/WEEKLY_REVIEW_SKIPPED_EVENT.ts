import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

export const WEEKLY_REVIEW_SKIPPED_EVENT = "WEEKLY_REVIEW_SKIPPED_EVENT";

export const WeeklyReviewSkippedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(WEEKLY_REVIEW_SKIPPED_EVENT),
  payload: z.object({ weekIsoId: tools.WeekIsoId, userId: Auth.VO.UserId }),
});

export type WeeklyReviewSkippedEventType = z.infer<typeof WeeklyReviewSkippedEvent>;
