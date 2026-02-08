import type * as Events from "+ai/events";

export type AIEvents = Events.AiRequestRegisteredEventType | Events.AiQuotaExceededEventType;

export interface AiEventPublisherPort {
  publish(events: ReadonlyArray<AIEvents>): Promise<void>;
}
