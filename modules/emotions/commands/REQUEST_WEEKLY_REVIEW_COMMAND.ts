import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const REQUEST_WEEKLY_REVIEW_COMMAND = "REQUEST_WEEKLY_REVIEW_COMMAND";

export const RequestWeeklyReviewCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REQUEST_WEEKLY_REVIEW_COMMAND),
  payload: z.object({
    weekStart: z.instanceof(VO.WeekStart),
    userId: Auth.VO.UserId,
  }),
});

export type RequestWeeklyReviewCommandType = z.infer<typeof RequestWeeklyReviewCommand>;
