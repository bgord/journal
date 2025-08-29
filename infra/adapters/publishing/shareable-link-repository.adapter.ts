import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

class ShareableLinkRepositoryAdapterInternal implements Publishing.Ports.ShareableLinkRepositoryPort {
  constructor(private readonly IdProvider: bg.IdProviderPort) {}

  async load(id: Publishing.VO.ShareableLinkIdType) {
    const history = await EventStore.find(
      Publishing.Aggregates.ShareableLink.events,
      Publishing.Aggregates.ShareableLink.getStream(id),
    );
    return Publishing.Aggregates.ShareableLink.build(id, history, { IdProvider: this.IdProvider });
  }

  async save(aggregate: Publishing.Aggregates.ShareableLink) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const ShareableLinkRepository = new ShareableLinkRepositoryAdapterInternal(IdProvider);
