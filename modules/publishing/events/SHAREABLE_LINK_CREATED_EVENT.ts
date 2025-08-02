import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SHAREABLE_LINK_CREATED = "SHAREABLE_LINK_CREATED";

export const ShareableLinkCreatedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SHAREABLE_LINK_CREATED),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    ownerId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRangeStart: tools.Timestamp,
    dateRangeEnd: tools.Timestamp,
    durationMs: tools.Timestamp,
    createdAt: tools.Timestamp,
  }),
});

export type ShareableLinkCreatedEventType = z.infer<typeof ShareableLinkCreatedEvent>;
