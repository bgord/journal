import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const COMPLETE_WEEKLY_REVIEW_COMMAND = "COMPLETE_WEEKLY_REVIEW_COMMAND";

export const CompleteWeeklyReviewCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(COMPLETE_WEEKLY_REVIEW_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    insights: VO.EmotionalAdvice,
  }),
});

export type CompleteWeeklyReviewCommandType = z.infer<typeof CompleteWeeklyReviewCommand>;
