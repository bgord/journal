import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+ai/value-objects";

export const AI_REQUEST_REGISTERED_EVENT = "AI_REQUEST_REGISTERED_EVENT";

export const AiRequestRegisteredEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(AI_REQUEST_REGISTERED_EVENT),
  payload: v.object({
    category: v.enum(VO.UsageCategory),
    dimensions: v.union([v.object({ entryId: v.pipe(v.string(), v.uuid()) }), v.object({})]),
    timestamp: tools.TimestampValue,
    userId: Auth.VO.UserId,
  }),
});

export type AiRequestRegisteredEventType = v.InferOutput<typeof AiRequestRegisteredEvent>;
