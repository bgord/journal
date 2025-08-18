import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as Events from "+app/events";
import type * as Buses from "+app/ports";

type AcceptedEvent = Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.RequestWeeklyReviewCommandType;

export class WeeklyReviewScheduler {
  constructor(
    EventBus: Buses.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<AcceptedCommand>,
    private readonly userDirectory: Auth.OHQ.UserDirectoryOHQ,
  ) {
    EventBus.on(Events.HOUR_HAS_PASSED_EVENT, EventHandler.handle(this.onHourHasPassed.bind(this)));
  }

  async onHourHasPassed(event: Events.HourHasPassedEventType) {
    if (Emotions.Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const week = tools.Week.fromNow();

    const userIds = await this.userDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const command = Emotions.Commands.RequestWeeklyReviewCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { week, userId },
      } satisfies Emotions.Commands.RequestWeeklyReviewCommandType);

      await this.CommandBus.emit(command.name, command);
    }
  }
}
