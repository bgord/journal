import type * as bg from "@bgord/bun";
import type { createEventStore } from "+infra/adapters/system/event-store";
import { createExpiringShareableLinks } from "./expiring-shareable-links";
import { createShareableLinkAccess } from "./shareable-link-access.adapter";
import { createShareableLinkAccessAuditor } from "./shareable-link-access-auditor.adapter";
import { createShareableLinkRepository } from "./shareable-link-repository.adapter";
import { createShareableLinkSnapshot } from "./shareable-link-snapshot.adapter";
import { createShareableLinksQuota } from "./shareable-links-quota.adapter";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  EventStore: ReturnType<typeof createEventStore>;
};

export function createPublishingAdapters(deps: Dependencies) {
  const ShareableLinkAccessAuditor = createShareableLinkAccessAuditor(deps);
  const ShareableLinkRepository = createShareableLinkRepository(deps);

  return {
    ExpiringShareableLinks: createExpiringShareableLinks(),
    ShareableLinkAccess: createShareableLinkAccess({
      ShareableLinkAccessAuditor,
      ShareableLinkRepository,
    }),
    ShareableLinkAccessAuditor,
    ShareableLinkRepository,
    ShareableLinkSnapshot: createShareableLinkSnapshot(),
    ShareableLinksQuota: createShareableLinksQuota(),
  };
}
