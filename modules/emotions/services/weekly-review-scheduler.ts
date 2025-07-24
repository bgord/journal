import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewScheduler {
  static cron = bg.Jobs.SCHEDULES.DAY_TIME(bg.UTC_DAY_OF_THE_WEEK.Monday, new tools.Hour(18));

  static label = "WeeklyReviewScheduler";

  static async process() {
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
