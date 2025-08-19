import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_ACCESSED_EVENT = "SHAREABLE_LINK_ACCESSED_EVENT";

export const ShareableLinkAccessedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SHAREABLE_LINK_ACCESSED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    validity: z.enum(["accepted", "rejected"]),
    visitorId: z.string(),
    timestamp: tools.Timestamp,
  }),
});

export type ShareableLinkAccessedEventType = z.infer<typeof ShareableLinkAccessedEvent>;
