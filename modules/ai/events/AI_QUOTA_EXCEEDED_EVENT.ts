import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";

export const AI_QUOTA_EXCEEDED_EVENT = "AI_QUOTA_EXCEEDED_EVENT";

export const AiQuotaExceededEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(AI_QUOTA_EXCEEDED_EVENT),
  payload: z.object({ timestamp: tools.TimestampValue, userId: Auth.VO.UserId }),
});

export type AiQuotaExceededEventType = z.infer<typeof AiQuotaExceededEvent>;
