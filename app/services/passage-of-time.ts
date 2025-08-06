import * as Events from "+app/events";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class PassageOfTime {
  static cron = bg.Jobs.SCHEDULES.EVERY_HOUR;

  static label = "PassageOfTime";

  static async process() {
    const timestamp = tools.Timestamp.parse(Date.now());

    const event = Events.HourHasPassedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: timestamp,
      name: Events.HOUR_HAS_PASSED_EVENT,
      stream: "passage_of_time",
      version: 1,
      payload: { timestamp: timestamp },
    } satisfies Events.HourHasPassedEventType);

    await EventStore.save([event]);
  }
}
