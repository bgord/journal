import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

export const ShareableLinkAccessAuditor = new Publishing.Ports.ShareableLinkAccessAuditorAdapter(EventStore);
