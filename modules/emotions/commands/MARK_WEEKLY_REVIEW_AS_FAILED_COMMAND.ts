import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const MARK_WEEKLY_REVIEW_AS_FIELD_COMMAND = "MARK_WEEKLY_REVIEW_AS_FIELD_COMMAND";

export const MarkWeeklyReviewAsFieldCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(MARK_WEEKLY_REVIEW_AS_FIELD_COMMAND),
  payload: z.object({
    weeklyReviewId: VO.WeeklyReviewId,
    insights: z.instanceof(VO.EmotionalAdvice),
  }),
});

export type MarkWeeklyReviewAsFieldCommandType = z.infer<typeof MarkWeeklyReviewAsFieldCommand>;
