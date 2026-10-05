import * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import { ExpiringShareableLinks } from "./expiring-shareable-links";
import { HideShareableLink } from "./hide-shareable-link.adapter";
import { createShareableLinkAccessOHQ } from "./shareable-link-access.adapter";
import { createShareableLinkAccessAuditor } from "./shareable-link-access-auditor.adapter";
import { ShareableLinkSnapshot } from "./shareable-link-snapshot.adapter";
import { ShareableLinksQuotaQuery } from "./shareable-links-quota.adapter";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Publishing.Aggregates.ShareableLinkEventType>;
};

export function createPublishingAdapters(deps: Dependencies) {
  const ShareableLinkAccessAuditor = createShareableLinkAccessAuditor(deps);
  const ShareableLinkRepository = new bg.EventSourcedRepositoryAdapter(
    { aggregate: Publishing.Aggregates.ShareableLink },
    deps,
  );

  return {
    ExpiringShareableLinks,
    HideShareableLink,
    ShareableLinkAccessOHQ: createShareableLinkAccessOHQ({
      ShareableLinkAccessAuditor,
      ShareableLinkRepository,
    }),
    ShareableLinkAccessAuditor,
    ShareableLinkRepository,
    ShareableLinkSnapshot,
    ShareableLinksQuotaQuery,
  };
}
