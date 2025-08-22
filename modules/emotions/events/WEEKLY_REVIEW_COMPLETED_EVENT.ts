import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const WEEKLY_REVIEW_COMPLETED_EVENT = "WEEKLY_REVIEW_COMPLETED_EVENT";

export const WeeklyReviewCompletedEvent = z.object({
  ...BaseEventData,
  name: z.literal(WEEKLY_REVIEW_COMPLETED_EVENT),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    insights: AI.AdviceSchema,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewCompletedEventType = z.infer<typeof WeeklyReviewCompletedEvent>;
