import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_CREATED_EVENT = "SHAREABLE_LINK_CREATED_EVENT";

export const ShareableLinkCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(SHAREABLE_LINK_CREATED_EVENT),
  payload: v.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRangeStart: tools.TimestampValue,
    dateRangeEnd: tools.TimestampValue,
    durationMs: tools.DurationMs,
    createdAt: tools.TimestampValue,
  }),
});

export type ShareableLinkCreatedEventType = v.InferOutput<typeof ShareableLinkCreatedEvent>;
