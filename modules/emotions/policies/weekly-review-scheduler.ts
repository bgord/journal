import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as wip from "+infra/build";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.RequestWeeklyReviewCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  UserDirectoryOHQ: Auth.OHQ.UserDirectoryOHQ;
};

export class WeeklyReviewScheduler {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    if (!Emotions.Invariants.WeeklyReviewSchedule.passes({ timestamp: event.payload.timestamp })) return;

    const week = tools.Week.fromTimestampValue(event.payload.timestamp).previous();

    const userIds = await this.deps.UserDirectoryOHQ.listActiveUserIds();

    for (const userId of userIds) {
      const command = wip.command(
        Emotions.Commands.RequestWeeklyReviewCommand,
        { payload: { week, userId } },
        this.deps,
      );

      await this.deps.CommandBus.emit(command);
    }
  }
}
