import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_ACCESSED_EVENT = "SHAREABLE_LINK_ACCESSED_EVENT";

export const ShareableLinkAccessedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(SHAREABLE_LINK_ACCESSED_EVENT),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    validity: z.enum(VO.AccessValidity),
    visitorId: z.string(),
    timestamp: tools.Timestamp,
    reason: z.string(),
  }),
});

export type ShareableLinkAccessedEventType = z.infer<typeof ShareableLinkAccessedEvent>;
