import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const createEventEnvelope = (stream: bg.EventStreamType) =>
  ({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    createdAt: tools.Time.Now().value,
    stream,
    version: 1,
  }) as const;
