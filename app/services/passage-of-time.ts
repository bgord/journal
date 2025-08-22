import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as System from "+system";
import { EventStore } from "+infra/event-store";

export class PassageOfTime {
  static cron = bg.Jobs.SCHEDULES.EVERY_HOUR;

  static label = "PassageOfTime";

  static async process() {
    const timestamp = tools.Time.Now().value;

    const event = System.Events.HourHasPassedEvent.parse({
      ...bg.createEventEnvelope("passage_of_time"),
      name: System.Events.HOUR_HAS_PASSED_EVENT,
      payload: { timestamp },
    } satisfies System.Events.HourHasPassedEventType);

    await EventStore.save([event]);
  }
}
