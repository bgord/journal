import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND = "SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND";

export const SendWeeklyReviewByEmailCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    userId: Auth.VO.UserId,
  }),
});

export type SendWeeklyReviewByEmailCommand = z.infer<typeof SendWeeklyReviewByEmailCommand>;
