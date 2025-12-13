import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import type { createEventBus } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: ReturnType<typeof createEventBus>;
  EventHandler: bg.EventHandler;
  IdProvider: bg.IdProviderPort;
};

export class ShareableLinkHitProjector {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Publishing.Events.SHAREABLE_LINK_ACCESSED_EVENT,
      deps.EventHandler.handle(this.onShareableLinkAccessedEvent.bind(this)),
    );
  }

  async onShareableLinkAccessedEvent(event: Publishing.Events.ShareableLinkAccessedEventType) {
    await db.insert(Schema.shareableLinkHits).values({
      id: this.deps.IdProvider.generate(),
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
