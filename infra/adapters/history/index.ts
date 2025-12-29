import type * as bg from "@bgord/bun";
import type { EventStoreType } from "+infra/tools/event-store";
import { HistoryProjection } from "./history-projection.adapter";
import { HistoryReader } from "./history-reader.adapter";
import { createHistoryWriter } from "./history-writer.adapter";

type Dependencies = { EventStore: EventStoreType; IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function createHistoryAdapters(deps: Dependencies) {
  return { HistoryProjection, HistoryReader, HistoryWriter: createHistoryWriter(deps) };
}
