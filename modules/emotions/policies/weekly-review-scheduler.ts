import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as System from "+system";

type AcceptedEvent = System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.RequestWeeklyReviewCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  UserDirectory: Auth.OHQ.UserDirectoryOHQ;
};

export class WeeklyReviewScheduler {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;

    // TODO here?
    const week = tools.Week.fromNow(event.payload.timestamp);

    const userIds = await this.deps.UserDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const command = Emotions.Commands.RequestWeeklyReviewCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Emotions.Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
        payload: { week, userId },
      } satisfies Emotions.Commands.RequestWeeklyReviewCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    }
  }
}
