import * as Auth from "+auth";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const AI_QUOTA_EXCEEDED_EVENT = "AI_QUOTA_EXCEEDED_EVENT";

export const AiQuotaExceededEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(AI_QUOTA_EXCEEDED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({ timestamp: tools.Timestamp, userId: Auth.VO.UserId }),
});

export type AiQuotaExceededEventType = z.infer<typeof AiQuotaExceededEvent>;
