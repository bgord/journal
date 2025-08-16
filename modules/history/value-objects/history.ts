import { z } from "zod/v4";
import { HistoryId } from "./history-id";
import { HistoryOperation } from "./history-operation";
import { HistoryPayload } from "./history-payload";
import { HistorySubject } from "./history-subject";

export const History = z.object({
  id: HistoryId,
  operation: HistoryOperation,
  payload: HistoryPayload,
  subject: HistorySubject,
});
export type HistoryType = z.infer<typeof History>;
