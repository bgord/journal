import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const AI_QUOTA_EXCEEDED_EVENT = "AI_QUOTA_EXCEEDED_EVENT";

export const AiQuotaExceededEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(AI_QUOTA_EXCEEDED_EVENT),
  payload: v.object({ timestamp: tools.TimestampValue, userId: Auth.VO.UserId }),
});

export type AiQuotaExceededEventType = v.InferOutput<typeof AiQuotaExceededEvent>;
