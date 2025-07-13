import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const ENTRY_DELETED_EVENT = "ENTRY_DELETED_EVENT";

export const EntryDeletedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ENTRY_DELETED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue,
  payload: z.object({ entryId: VO.EntryId }),
});

export type EntryDeletedEventType = z.infer<typeof EntryDeletedEvent>;
