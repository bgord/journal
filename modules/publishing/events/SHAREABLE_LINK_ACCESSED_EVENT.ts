import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_ACCESSED_EVENT = "SHAREABLE_LINK_ACCESSED_EVENT";

export const ShareableLinkAccessedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(SHAREABLE_LINK_ACCESSED_EVENT),
  payload: v.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    validity: v.enum(VO.AccessValidity),
    visitorId: bg.HashValue,
    timestamp: tools.TimestampValue,
    reason: v.string(),
  }),
});

export type ShareableLinkAccessedEventType = v.InferOutput<typeof ShareableLinkAccessedEvent>;
