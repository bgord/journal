import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as infra from "@infra";
import * as Commands from "../commands";
import * as VO from "../value-objects";

export class WeeklyReviewScheduler {
  // Sunday at 18:00 UTC
  static cron = `0 18 * * ${bg.UTC_DAY_OF_THE_WEEK.Monday}`;

  static label = "WeeklyReviewScheduler";

  static async process() {
    const weekStart = VO.WeekStart.fromTimestamp(Date.now());

    const command = Commands.RequestWeeklyReviewCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { weekStart },
    } satisfies Commands.RequestWeeklyReviewCommandType);

    await infra.CommandBus.emit(command.name, command);
  }
}
