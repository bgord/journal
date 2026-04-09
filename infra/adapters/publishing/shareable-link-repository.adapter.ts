import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Publishing.Aggregates.ShareableLinkEventType>;
};

class ShareableLinkRepositoryAdapterInternal implements Publishing.Ports.ShareableLinkRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Publishing.VO.ShareableLinkIdType): Promise<Publishing.Aggregates.ShareableLink> {
    const history = await this.deps.EventStore.find(
      Publishing.Aggregates.ShareableLink.registry,
      Publishing.Aggregates.ShareableLink.getStream(id),
    );
    return Publishing.Aggregates.ShareableLink.build(id, history, this.deps);
  }

  async save(aggregate: Publishing.Aggregates.ShareableLink): Promise<void> {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createShareableLinkRepository(
  deps: Dependencies,
): Publishing.Ports.ShareableLinkRepositoryPort {
  return new ShareableLinkRepositoryAdapterInternal(deps);
}
