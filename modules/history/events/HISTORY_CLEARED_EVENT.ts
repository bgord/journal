import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+history/value-objects";

export const HISTORY_CLEARED_EVENT = "HISTORY_CLEARED_EVENT";

export const HistoryClearedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(HISTORY_CLEARED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: VO.History.pick({ correlationId: true }),
});

export type HistoryClearedEventType = z.infer<typeof HistoryClearedEvent>;
