import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+auth/value-objects";

export const ACCOUNT_CREATED_EVENT = "ACCOUNT_CREATED_EVENT";

export const AccountCreatedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ACCOUNT_CREATED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({ userId: VO.UserId, timestamp: tools.Timestamp }),
});

export type AccountCreatedEventType = z.infer<typeof AccountCreatedEvent>;
