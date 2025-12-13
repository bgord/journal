import type { AIEvents, AiEventPublisherPort } from "+ai/ports/ai-event-publisher";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = { EventStore: ReturnType<typeof createEventStore> };

class AiEventStorePublisherInternal implements AiEventPublisherPort {
  constructor(private readonly deps: Dependencies) {}

  async publish(events: AIEvents[]) {
    await this.deps.EventStore.save(events);
  }
}

export function createAiEventPublisher(deps: Dependencies): AiEventPublisherPort {
  return new AiEventStorePublisherInternal(deps);
}
