import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

class ShareableLinkRepositoryAdapterInternal implements Publishing.Ports.ShareableLinkRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Publishing.VO.ShareableLinkIdType) {
    const history = await EventStore.find(
      Publishing.Aggregates.ShareableLink.events,
      Publishing.Aggregates.ShareableLink.getStream(id),
    );
    return Publishing.Aggregates.ShareableLink.build(id, history, this.deps);
  }

  async save(aggregate: Publishing.Aggregates.ShareableLink) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const ShareableLinkRepository = new ShareableLinkRepositoryAdapterInternal({ IdProvider, Clock });
