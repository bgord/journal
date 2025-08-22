import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+auth/value-objects";
import { BaseEventData } from "../../../base";

export const ACCOUNT_DELETED_EVENT = "ACCOUNT_DELETED_EVENT";

export const AccountDeletedEvent = z.object({
  ...BaseEventData,
  name: z.literal(ACCOUNT_DELETED_EVENT),
  payload: z.object({ userId: VO.UserId, timestamp: tools.Timestamp }),
});

export type AccountDeletedEventType = z.infer<typeof AccountDeletedEvent>;
