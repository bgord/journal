import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SHAREABLE_LINK_EXPIRED = "SHAREABLE_LINK_EXPIRED";

export const ShareableLinkExpiredEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SHAREABLE_LINK_EXPIRED),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkExpiredEventType = z.infer<typeof ShareableLinkExpiredEvent>;
