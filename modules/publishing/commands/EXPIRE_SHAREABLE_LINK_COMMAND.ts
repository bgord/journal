import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+publishing/value-objects";
import { CommandEnvelopeSchema } from "../../../base";

export const EXPIRE_SHAREABLE_LINK_COMMAND = "EXPIRE_SHAREABLE_LINK_COMMAND";

export const ExpireShareableLinkCommand = z.object({
  ...CommandEnvelopeSchema,
  name: z.literal(EXPIRE_SHAREABLE_LINK_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ExpireShareableLinkCommandType = z.infer<typeof ExpireShareableLinkCommand>;
