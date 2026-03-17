import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ENTRY_DELETED_EVENT = "ENTRY_DELETED_EVENT";

export const EntryDeletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ENTRY_DELETED_EVENT),
  payload: v.object({ entryId: VO.EntryId, userId: Auth.VO.UserId }),
});

export type EntryDeletedEventType = v.InferOutput<typeof EntryDeletedEvent>;
