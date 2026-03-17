import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

// Stryker disable all
export const REVOKE_SHAREABLE_LINK_COMMAND = "REVOKE_SHAREABLE_LINK_COMMAND";
// Stryker restore all

export const RevokeShareableLinkCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(REVOKE_SHAREABLE_LINK_COMMAND),
  revision: v.instance(tools.Revision),
  payload: v.object({ shareableLinkId: VO.ShareableLinkId, requesterId: Auth.VO.UserId }),
});

export type RevokeShareableLinkCommandType = v.InferOutput<typeof RevokeShareableLinkCommand>;
