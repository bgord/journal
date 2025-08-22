import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const CommandEnvelopeSchema = {
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
};

export const createCommandEnvelope = () =>
  ({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    createdAt: tools.Time.Now().value,
  }) as const;
