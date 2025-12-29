import type * as bg from "@bgord/bun";
import type { EventStoreType } from "+infra/tools/event-store";
import { ExpiringShareableLinks } from "./expiring-shareable-links";
import { createShareableLinkAccessOHQ } from "./shareable-link-access.adapter";
import { createShareableLinkAccessAuditor } from "./shareable-link-access-auditor.adapter";
import { createShareableLinkRepository } from "./shareable-link-repository.adapter";
import { ShareableLinkSnapshot } from "./shareable-link-snapshot.adapter";
import { ShareableLinksQuotaQuery } from "./shareable-links-quota.adapter";

type Dependencies = { Clock: bg.ClockPort; IdProvider: bg.IdProviderPort; EventStore: EventStoreType };

export function createPublishingAdapters(deps: Dependencies) {
  const ShareableLinkAccessAuditor = createShareableLinkAccessAuditor(deps);
  const ShareableLinkRepository = createShareableLinkRepository(deps);

  return {
    ExpiringShareableLinks,
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
