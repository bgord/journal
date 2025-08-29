import * as Publishing from "+publishing";
import { IdProvider } from "+infra/adapters";
import { EventStore } from "+infra/event-store";

export const ShareableLinkAccessAuditor = new Publishing.Ports.ShareableLinkAccessAuditorAdapter(
  EventStore,
  IdProvider,
);
