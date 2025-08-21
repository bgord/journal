import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class ShareableLinkHitProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Publishing.Events.SHAREABLE_LINK_ACCESSED_EVENT,
      EventHandler.handle(this.onShareableLinkAccessedEvent.bind(this)),
    );
  }

  async onShareableLinkAccessedEvent(event: Publishing.Events.ShareableLinkAccessedEventType) {
    await db.insert(Schema.shareableLinkHits).values({
      id: crypto.randomUUID(),
      shareableLinkId: event.payload.shareableLinkId,
      ownerId: event.payload.ownerId,
      publicationSpecification: event.payload.publicationSpecification,
      validity: event.payload.validity,
      reason: event.payload.reason,
      visitorId: event.payload.visitorId,
      timestamp: event.payload.timestamp,
    });
  }
}
