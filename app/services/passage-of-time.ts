import * as bg from "@bgord/bun";

type Dependencies = {
  EventStore: bg.EventStoreLike<bg.System.Events.HourHasPassedEventType>;
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
};

export class PassageOfTime implements bg.UnitOfWork {
  constructor(private readonly deps: Dependencies) {}

  static cron = bg.Jobs.SCHEDULES.EVERY_HOUR;

  label = "PassageOfTime";

  async process() {
    const timestamp = this.deps.Clock.nowMs();

    const event = bg.System.Events.HourHasPassedEvent.parse({
      ...bg.createEventEnvelope("passage_of_time", this.deps),
      name: bg.System.Events.HOUR_HAS_PASSED_EVENT,
      payload: { timestamp },
    } satisfies bg.System.Events.HourHasPassedEventType);

    await this.deps.EventStore.save([event]);
  }
}
