import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND = "SEND_WEEKLY_REVIEW_BY_EMAIL_COMMAND";

export const ExportWeeklyReviewByEmailCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND),
  payload: z.object({ weeklyReviewId: VO.WeeklyReviewId, userId: Auth.VO.UserId }),
});

export type ExportWeeklyReviewByEmailCommandType = z.infer<typeof ExportWeeklyReviewByEmailCommand>;
