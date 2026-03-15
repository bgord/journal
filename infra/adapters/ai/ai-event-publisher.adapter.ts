import type * as bg from "@bgord/bun";
import type { AIEvents, AiEventPublisherPort } from "+ai/ports/ai-event-publisher";

type Dependencies = { EventStore: bg.EventStorePort<AIEvents> };

class AiEventStorePublisherInternal implements AiEventPublisherPort {
  constructor(private readonly deps: Dependencies) {}

  async publish(events: ReadonlyArray<AIEvents>) {
    await this.deps.EventStore.save(events);
  }
}

export function createAiEventPublisher(deps: Dependencies): AiEventPublisherPort {
  return new AiEventStorePublisherInternal(deps);
}
