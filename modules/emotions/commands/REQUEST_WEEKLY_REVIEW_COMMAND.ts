import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

// Stryker disable next-line StringLiteral
export const REQUEST_WEEKLY_REVIEW_COMMAND = "REQUEST_WEEKLY_REVIEW_COMMAND";

export const RequestWeeklyReviewCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(REQUEST_WEEKLY_REVIEW_COMMAND),
  payload: v.object({ week: v.instance(tools.Week), userId: Auth.VO.UserId }),
});

export type RequestWeeklyReviewCommandType = v.InferOutput<typeof RequestWeeklyReviewCommand>;
