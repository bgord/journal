import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

export const REQUEST_WEEKLY_REVIEW_COMMAND = "REQUEST_WEEKLY_REVIEW_COMMAND";

export const RequestWeeklyReviewCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REQUEST_WEEKLY_REVIEW_COMMAND),
  payload: z.object({
    week: z.instanceof(tools.Week),
    userId: Auth.VO.UserId,
  }),
});

export type RequestWeeklyReviewCommandType = z.infer<typeof RequestWeeklyReviewCommand>;
