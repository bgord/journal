import type * as bg from "@bgord/bun";
import type { createEventStore } from "+infra/adapters/system/event-store";
import { createHistoryProjection } from "./history-projection.adapter";
import { createHistoryReader } from "./history-reader.adapter";
import { createHistoryWriter } from "./history-writer.adapter";

type Dependencies = {
  EventStore: ReturnType<typeof createEventStore>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export function createHistoryAdapters(deps: Dependencies) {
  return {
    HistoryProjection: createHistoryProjection(),
    HistoryReader: createHistoryReader(),
    HistoryWriter: createHistoryWriter(deps),
  };
}
