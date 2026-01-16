import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";

export const WEEKLY_REVIEW_SKIPPED_EVENT = "WEEKLY_REVIEW_SKIPPED_EVENT";

export const WeeklyReviewSkippedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(WEEKLY_REVIEW_SKIPPED_EVENT),
  payload: z.object({ weekIsoId: tools.WeekIsoId, userId: Auth.VO.UserId }),
});

export type WeeklyReviewSkippedEventType = z.infer<typeof WeeklyReviewSkippedEvent>;
