import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const REVOKE_SHAREABLE_LINK_COMMAND = "REVOKE_SHAREABLE_LINK_COMMAND";

export const RevokeShareableLinkCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(REVOKE_SHAREABLE_LINK_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId, requesterId: Auth.VO.UserId }),
});

export type RevokeShareableLinkCommandType = z.infer<typeof RevokeShareableLinkCommand>;
