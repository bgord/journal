import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const REVOKE_SHAREABLE_LINK_COMMAND = "REVOKE_SHAREABLE_LINK_COMMAND";

export const RevokeShareableLinkCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REVOKE_SHAREABLE_LINK_COMMAND),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type RevokeShareableLinkCommandType = z.infer<typeof RevokeShareableLinkCommand>;
