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
  UserDirectory: Auth.OHQ.UserDirectoryOHQ;
};

export class WeeklyReviewScheduler {
  constructor(private readonly DI: Dependencies) {
    DI.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      DI.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const week = tools.Week.fromNow();

    const userIds = await this.DI.UserDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const command = Emotions.Commands.RequestWeeklyReviewCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
        payload: { week, userId },
      } satisfies Emotions.Commands.RequestWeeklyReviewCommandType);

      await this.DI.CommandBus.emit(command.name, command);
    }
  }
}
