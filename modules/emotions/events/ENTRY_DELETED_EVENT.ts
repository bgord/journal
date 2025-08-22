import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const ENTRY_DELETED_EVENT = "ENTRY_DELETED_EVENT";

export const EntryDeletedEvent = z.object({
  ...BaseEventData,
  name: z.literal(ENTRY_DELETED_EVENT),
  payload: z.object({ entryId: VO.EntryId, userId: Auth.VO.UserId }),
});

export type EntryDeletedEventType = z.infer<typeof EntryDeletedEvent>;
