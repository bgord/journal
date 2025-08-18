import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

export class ShareableLinkRepositoryAdapterBg implements Publishing.Ports.ShareableLinkRepositoryPort {
  async load(id: Publishing.VO.ShareableLinkIdType) {
    const history = await EventStore.find(
      Publishing.Aggregates.ShareableLink.events,
      Publishing.Aggregates.ShareableLink.getStream(id),
    );
    return Publishing.Aggregates.ShareableLink.build(id, history);
  }

  async save(aggregate: Publishing.Aggregates.ShareableLink) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const ShareableLinkRepositoryAdapter = new ShareableLinkRepositoryAdapterBg();
