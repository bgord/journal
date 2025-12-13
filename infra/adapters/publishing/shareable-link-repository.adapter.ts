import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: ReturnType<typeof createEventStore>;
};

class ShareableLinkRepositoryAdapterInternal implements Publishing.Ports.ShareableLinkRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Publishing.VO.ShareableLinkIdType) {
    const history = await this.deps.EventStore.find(
      Publishing.Aggregates.ShareableLink.events,
      Publishing.Aggregates.ShareableLink.getStream(id),
    );
    return Publishing.Aggregates.ShareableLink.build(id, history, this.deps);
  }

  async save(aggregate: Publishing.Aggregates.ShareableLink) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createShareableLinkRepository(
  deps: Dependencies,
): Publishing.Ports.ShareableLinkRepositoryPort {
  return new ShareableLinkRepositoryAdapterInternal(deps);
}
