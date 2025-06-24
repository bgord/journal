import type { EventBus } from "../../../infra/event-bus";
import * as Events from "../events";

export class AlarmProcessing {
  static register(eventBus: typeof EventBus) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, AlarmProcessing.onAlarmGeneratedEvent);
  }

  static async onAlarmGeneratedEvent(_event: Events.AlarmGeneratedEventType) {
    console.log("processing alarm generated event");
  }
}
