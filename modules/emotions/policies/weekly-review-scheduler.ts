import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.RequestWeeklyReviewCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerPort;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  UserDirectoryOHQ: Auth.OHQ.UserDirectoryOHQ;
};

export class WeeklyReviewScheduler {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const week = tools.Week.fromTimestampValue(event.payload.timestamp).previous();

    const userIds = await this.deps.UserDirectoryOHQ.listActiveUserIds();

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
