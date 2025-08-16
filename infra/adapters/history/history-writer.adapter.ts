import { HistoryWriterEventStore } from "+infra/adapters/history/history-writer-event-store.adapter";
import { EventStore } from "+infra/event-store";

export const HistoryWriter = new HistoryWriterEventStore(EventStore);
