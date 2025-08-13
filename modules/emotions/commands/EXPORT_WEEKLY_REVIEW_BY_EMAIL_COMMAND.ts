import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND = "SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND";

export const ExportWeeklyReviewByEmailCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND),
  payload: z.object({ weeklyReviewId: VO.WeeklyReviewId, userId: Auth.VO.UserId }),
});

export type ExportWeeklyReviewByEmailCommand = z.infer<typeof ExportWeeklyReviewByEmailCommand>;
