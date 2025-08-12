import * as VO from "+ai/value-objects";
import * as Auth from "+auth";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const AI_REQUEST_REGISTERED_EVENT = "AI_REQUEST_REGISTERED_EVENT";

export const DimensionSchemas = {
  [VO.UsageCategory.EMOTIONS_ALARM_ENTRY]: z.object({ entryId: z.uuid() }),
  [VO.UsageCategory.EMOTIONS_ALARM_INACTIVITY]: z.object({}).strict(),
  [VO.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT]: z.object({}).strict(),
} as const satisfies Record<VO.UsageCategory, z.ZodType>;

export const AiRequestRegisteredEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(AI_REQUEST_REGISTERED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    category: z.enum(VO.UsageCategory),
    dimensions: DimensionSchemas,
    timestamp: tools.Timestamp,
    userId: Auth.VO.UserId,
  }),
});

export type AiRequestRegisteredEventType = z.infer<typeof AiRequestRegisteredEvent>;
