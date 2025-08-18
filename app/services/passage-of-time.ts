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
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: timestamp,
      name: System.Events.HOUR_HAS_PASSED_EVENT,
      stream: "passage_of_time",
      version: 1,
      payload: { timestamp },
    } satisfies System.Events.HourHasPassedEventType);

    await EventStore.save([event]);
  }
}
