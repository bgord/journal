import type { AIEvents, AiEventPublisherPort } from "+ai/ports/ai-event-publisher";
import { EventStore } from "+infra/event-store";

export class AiEventStorePublisherBg implements AiEventPublisherPort {
  async publish(events: AIEvents[]): Promise<void> {
    await EventStore.save(events);
  }
}
