import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+auth/value-objects";

const ACCOUNT_DELETED_EVENT = "ACCOUNT_DELETED_EVENT";

export const AccountDeletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ACCOUNT_DELETED_EVENT),
  payload: v.object({ userId: VO.UserId, timestamp: tools.TimestampValue }),
});

export type AccountDeletedEventType = v.InferOutput<typeof AccountDeletedEvent>;
