import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_CREATED_EVENT = "SHAREABLE_LINK_CREATED_EVENT";

export const ShareableLinkCreatedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(SHAREABLE_LINK_CREATED_EVENT),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRangeStart: tools.Timestamp,
    dateRangeEnd: tools.Timestamp,
    durationMs: tools.DurationMs,
    createdAt: tools.Timestamp,
  }),
});

export type ShareableLinkCreatedEventType = z.infer<typeof ShareableLinkCreatedEvent>;
