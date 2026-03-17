import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_FAILED_EVENT = "WEEKLY_REVIEW_FAILED_EVENT";

export const WeeklyReviewFailedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_REVIEW_FAILED_EVENT),
  payload: v.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewFailedEventType = v.InferOutput<typeof WeeklyReviewFailedEvent>;
