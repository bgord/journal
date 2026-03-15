import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  EventStore: bg.EventStorePort<Publishing.Events.ShareableLinkAccessedEventType>;
};

export function createShareableLinkAccessAuditor(
  deps: Dependencies,
): Publishing.Ports.ShareableLinkAccessAuditorAdapter {
  return new Publishing.Ports.ShareableLinkAccessAuditorAdapter(deps);
}
