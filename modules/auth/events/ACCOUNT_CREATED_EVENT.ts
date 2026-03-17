import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+auth/value-objects";

export const ACCOUNT_CREATED_EVENT = "ACCOUNT_CREATED_EVENT";

export const AccountCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ACCOUNT_CREATED_EVENT),
  payload: v.object({ userId: VO.UserId, timestamp: tools.TimestampValue }),
});

export type AccountCreatedEventType = v.InferOutput<typeof AccountCreatedEvent>;
