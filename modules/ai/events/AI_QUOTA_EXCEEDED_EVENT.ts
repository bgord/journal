import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import { BaseEventData } from "../../../base";

export const AI_QUOTA_EXCEEDED_EVENT = "AI_QUOTA_EXCEEDED_EVENT";

export const AiQuotaExceededEvent = z.object({
  ...BaseEventData,
  name: z.literal(AI_QUOTA_EXCEEDED_EVENT),
  payload: z.object({ timestamp: tools.Timestamp, userId: Auth.VO.UserId }),
});

export type AiQuotaExceededEventType = z.infer<typeof AiQuotaExceededEvent>;
