import type { AIEvents, AiEventPublisherPort } from "+ai/ports/ai-event-publisher";
import { EventStore } from "+infra/event-store";

class AiEventStorePublisherBg implements AiEventPublisherPort {
  async publish(events: AIEvents[]) {
    await EventStore.save(events);
  }
}

export const AiEventStorePublisher = new AiEventStorePublisherBg();
