import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import type { EventStoreType } from "+infra/adapters/system/event-store";

type Dependencies = { Clock: bg.ClockPort; IdProvider: bg.IdProviderPort; EventStore: EventStoreType };

export function createShareableLinkAccessAuditor(
  deps: Dependencies,
): Publishing.Ports.ShareableLinkAccessAuditorAdapter {
  return new Publishing.Ports.ShareableLinkAccessAuditorAdapter(deps);
}
