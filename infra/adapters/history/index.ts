import type * as bg from "@bgord/bun";
import type { createEventStore } from "+infra/adapters/system/event-store";
import { HistoryProjection } from "./history-projection.adapter";
import { HistoryReader } from "./history-reader.adapter";
import { createHistoryWriter } from "./history-writer.adapter";

type Dependencies = {
  EventStore: ReturnType<typeof createEventStore>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export function createHistoryAdapters(deps: Dependencies) {
  return { HistoryProjection, HistoryReader, HistoryWriter: createHistoryWriter(deps) };
}
