import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";

// Stryker disable all
export const REQUEST_WEEKLY_REVIEW_COMMAND = "REQUEST_WEEKLY_REVIEW_COMMAND";
// Stryker restore all

export const RequestWeeklyReviewCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(REQUEST_WEEKLY_REVIEW_COMMAND),
  payload: z.object({ week: z.instanceof(tools.Week), userId: Auth.VO.UserId }),
});

export type RequestWeeklyReviewCommandType = z.infer<typeof RequestWeeklyReviewCommand>;
