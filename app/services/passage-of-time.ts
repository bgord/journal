import * as bg from "@bgord/bun";
import * as System from "+system";
import { Clock, IdProvider } from "+infra/adapters";
import { EventStore } from "+infra/event-store";

export class PassageOfTime {
  static cron = bg.Jobs.SCHEDULES.EVERY_HOUR;

  static label = "PassageOfTime";

  static async process() {
    const timestamp = Clock.nowMs();

    const event = System.Events.HourHasPassedEvent.parse({
      ...bg.createEventEnvelope("passage_of_time", { IdProvider, Clock }),
      name: System.Events.HOUR_HAS_PASSED_EVENT,
      payload: { timestamp },
    } satisfies System.Events.HourHasPassedEventType);

    await EventStore.save([event]);
  }
}
