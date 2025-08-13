import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const WEEKLY_REVIEW_COMPLETED_EVENT = "WEEKLY_REVIEW_COMPLETED_EVENT";

export const WeeklyReviewCompletedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(WEEKLY_REVIEW_COMPLETED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    weekIsoId: tools.WeekIsoId,
    insights: AI.AdviceSchema,
    userId: Auth.VO.UserId,
  }),
});

export type WeeklyReviewCompletedEventType = z.infer<typeof WeeklyReviewCompletedEvent>;
