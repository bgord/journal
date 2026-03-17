import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+publishing/value-objects";

// Stryker disable all
export const EXPIRE_SHAREABLE_LINK_COMMAND = "EXPIRE_SHAREABLE_LINK_COMMAND";
// Stryker restore all

export const ExpireShareableLinkCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXPIRE_SHAREABLE_LINK_COMMAND),
  revision: v.instance(tools.Revision),
  payload: v.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ExpireShareableLinkCommandType = v.InferOutput<typeof ExpireShareableLinkCommand>;
