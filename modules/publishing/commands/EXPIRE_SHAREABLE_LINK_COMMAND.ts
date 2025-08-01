import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const EXPIRE_SHAREABLE_LINK_COMMAND = "EXPIRE_SHAREABLE_LINK_COMMAND";

export const ExpireShareableLinkCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(EXPIRE_SHAREABLE_LINK_COMMAND),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ExpireShareableLinkCommandType = z.infer<typeof ExpireShareableLinkCommand>;
