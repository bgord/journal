import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+ai/value-objects";

export const AI_REQUEST_REGISTERED_EVENT = "AI_REQUEST_REGISTERED_EVENT";

export const AiRequestRegisteredEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(AI_REQUEST_REGISTERED_EVENT),
  payload: z.object({
    category: z.enum(VO.UsageCategory),
    dimensions: z.union([z.object({ entryId: z.uuid() }), z.object({}).strict()]),
    timestamp: tools.TimestampValue,
    userId: Auth.VO.UserId,
  }),
});

export type AiRequestRegisteredEventType = z.infer<typeof AiRequestRegisteredEvent>;
