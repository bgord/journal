import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const BaseEventData = {
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
};
