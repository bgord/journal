import type { EventBus } from "../../../infra/event-bus";
import { EventStore } from "../../../infra/event-store";
import * as Aggregates from "../aggregates";
import * as Events from "../events";
import * as Services from "../services";

export class AlarmProcessing {
  constructor(private readonly AiClient: Services.AiClient) {}

  register(eventBus: typeof EventBus) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent);
  }

  static async onAlarmGeneratedEvent(_event: Events.AlarmGeneratedEventType) {
    console.log("processing alarm generated event");
  }
}
