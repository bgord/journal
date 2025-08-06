import * as Events from "+app/events";
import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Invariants from "+emotions/invariants";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewScheduler {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Events.HOUR_HAS_PASSED_EVENT, this.onHourHasPassed.bind(this));
  }

  async onHourHasPassed(event: Events.HourHasPassedEventType) {
    if (Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const week = tools.Week.fromNow();

    const userIds = await Auth.Repos.UserRepository.listIds();

    for (const userId of userIds) {
      const command = Commands.RequestWeeklyReviewCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { week, userId },
      } satisfies Commands.RequestWeeklyReviewCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
