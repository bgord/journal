import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as Events from "+app/events";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";

export class WeeklyReviewScheduler {
  constructor(
    eventBus: typeof EventBus,
    EventHandler: bg.EventHandler,
    private readonly userDirectory: Auth.Ports.UserDirectoryPort,
  ) {
    eventBus.on(Events.HOUR_HAS_PASSED_EVENT, EventHandler.handle(this.onHourHasPassed.bind(this)));
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

      await CommandBus.emit(command.name, command);
    }
  }
}
