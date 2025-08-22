import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const WEEKLY_REVIEW_FAILED_EVENT = "WEEKLY_REVIEW_FAILED_EVENT";

export const WeeklyReviewFailedEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(WEEKLY_REVIEW_FAILED_EVENT),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewFailedEventType = z.infer<typeof WeeklyReviewFailedEvent>;
