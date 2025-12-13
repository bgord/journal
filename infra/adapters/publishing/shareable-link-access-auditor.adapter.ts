import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  EventStore: ReturnType<typeof createEventStore>;
};

export function createShareableLinkAccessAuditor(
  deps: Dependencies,
): Publishing.Ports.ShareableLinkAccessAuditorAdapter {
  return new Publishing.Ports.ShareableLinkAccessAuditorAdapter(deps);
}
