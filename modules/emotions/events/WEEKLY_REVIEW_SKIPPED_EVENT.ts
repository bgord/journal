import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const WEEKLY_REVIEW_SKIPPED_EVENT = "WEEKLY_REVIEW_SKIPPED_EVENT";

export const WeeklyReviewSkippedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_REVIEW_SKIPPED_EVENT),
  payload: v.object({ weekIsoId: tools.WeekIsoId, userId: Auth.VO.UserId }),
});

export type WeeklyReviewSkippedEventType = v.InferOutput<typeof WeeklyReviewSkippedEvent>;
