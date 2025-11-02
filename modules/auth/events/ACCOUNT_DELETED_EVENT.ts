import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+auth/value-objects";

export const ACCOUNT_DELETED_EVENT = "ACCOUNT_DELETED_EVENT";

export const AccountDeletedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(ACCOUNT_DELETED_EVENT),
  payload: z.object({ userId: VO.UserId, timestamp: tools.TimestampValue }),
});

export type AccountDeletedEventType = z.infer<typeof AccountDeletedEvent>;
