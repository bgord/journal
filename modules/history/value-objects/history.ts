import { z } from "zod/v4";
import { HistoryCorrelationId } from "./history-correlation-id";
import { HistoryId } from "./history-id";
import { HistoryOperation } from "./history-operation";
import { HistoryPayload } from "./history-payload";

export const History = z.object({
  id: HistoryId,
  operation: HistoryOperation,
  payload: HistoryPayload,
  correlationId: HistoryCorrelationId,
});
export type HistoryType = z.infer<typeof History>;
