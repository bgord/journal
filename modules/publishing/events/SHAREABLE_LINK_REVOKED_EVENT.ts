import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_REVOKED = "SHAREABLE_LINK_REVOKED";

export const ShareableLinkRevokedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SHAREABLE_LINK_REVOKED),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkRevokedEventType = z.infer<typeof ShareableLinkRevokedEvent>;
