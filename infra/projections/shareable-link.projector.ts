import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class ShareableLinkProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Publishing.Events.SHAREABLE_LINK_CREATED,
      EventHandler.handle(this.onShareableLinkCreatedEvent.bind(this)),
    );
    eventBus.on(
      Publishing.Events.SHAREABLE_LINK_EXPIRED,
      EventHandler.handle(this.onShareableLinkExpiredEvent.bind(this)),
    );
    eventBus.on(
      Publishing.Events.SHAREABLE_LINK_REVOKED,
      EventHandler.handle(this.onShareableLinkRevokedEvent.bind(this)),
    );
  }

  async onShareableLinkCreatedEvent(event: Publishing.Events.ShareableLinkCreatedEventType) {
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
  }

  async onShareableLinkExpiredEvent(event: Publishing.Events.ShareableLinkExpiredEventType) {
    await db
      .update(Schema.shareableLinks)
      .set({ updatedAt: event.createdAt, status: Publishing.VO.ShareableLinkStatusEnum.expired })
      .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
  }

  async onShareableLinkRevokedEvent(event: Publishing.Events.ShareableLinkRevokedEventType) {
    await db
      .update(Schema.shareableLinks)
      .set({ updatedAt: event.createdAt, status: Publishing.VO.ShareableLinkStatusEnum.revoked })
      .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
  }
}
