import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const DELETE_ENTRY_COMMAND = "DELETE_ENTRY_COMMAND";
// Stryker restore all

export const DeleteEntryCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(DELETE_ENTRY_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({ entryId: VO.EntryId, userId: Auth.VO.UserId }),
});

export type DeleteEntryCommandType = z.infer<typeof DeleteEntryCommand>;
