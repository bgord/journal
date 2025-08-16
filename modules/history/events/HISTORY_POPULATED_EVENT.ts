import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+history/value-objects";

export const HISTORY_POPULATED_EVENT = "HISTORY_POPULATED_EVENT";

export const HistoryPopulatedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(HISTORY_POPULATED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    id: VO.HistoryId,
    operation: VO.HistoryOperation,
    correlationId: VO.HistorySubject,
    payload: z.record(z.string(), z.any()),
  }),
});
export type HistoryPopulatedEventType = z.infer<typeof HistoryPopulatedEvent>;
