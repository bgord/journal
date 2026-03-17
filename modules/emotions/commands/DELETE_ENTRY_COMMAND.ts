import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const DELETE_ENTRY_COMMAND = "DELETE_ENTRY_COMMAND";
// Stryker restore all

export const DeleteEntryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DELETE_ENTRY_COMMAND),
  revision: v.instance(tools.Revision),
  payload: v.object({ entryId: VO.EntryId, userId: Auth.VO.UserId }),
});

export type DeleteEntryCommandType = v.InferOutput<typeof DeleteEntryCommand>;
