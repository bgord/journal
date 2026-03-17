import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_COMPLETED_EVENT = "WEEKLY_REVIEW_COMPLETED_EVENT";

export const WeeklyReviewCompletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_REVIEW_COMPLETED_EVENT),
  payload: v.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    insights: AI.AdviceSchema,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewCompletedEventType = v.InferOutput<typeof WeeklyReviewCompletedEvent>;
