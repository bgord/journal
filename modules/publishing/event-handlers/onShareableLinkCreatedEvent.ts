import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onShareableLinkCreatedEvent = async (event: Publishing.Events.ShareableLinkCreatedEventType) => {
  await db.insert(Schema.shareableLinks).values({
    id: event.payload.shareableLinkId,
    createdAt: event.payload.createdAt,
    updatedAt: event.payload.createdAt,
    status: Publishing.VO.ShareableLinkStatusEnum.active,
    revision: event.revision,
    ownerId: event.payload.ownerId,
    publicationSpecification: event.payload.publicationSpecification,
    dateRangeStart: event.payload.dateRangeStart,
    dateRangeEnd: event.payload.dateRangeEnd,
    durationMs: event.payload.durationMs,
    expiresAt: event.payload.createdAt + event.payload.durationMs,
  });
};
