import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const DELETE_ENTRY_COMMAND = "DELETE_ENTRY_COMMAND";

export const DeleteEntryCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(DELETE_ENTRY_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({ entryId: VO.EntryId }),
});

export type DeleteEntryCommandType = z.infer<typeof DeleteEntryCommand>;
