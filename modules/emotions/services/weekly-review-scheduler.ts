import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { startOfWeek } from "date-fns";
import * as infra from "../../../infra";
import * as Commands from "../commands";

export class WeeklyReviewScheduler {
  // Sunday at 18:00 UTC
  static cron = "0 18 * * 0";

  /** @public */
  static label = "WeeklyReviewScheduler";

  /** @public */
  static async process() {
    // TODO: figure out the correlationId
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekStartedAt = tools.Timestamp.parse(weekStart.getTime());

    const command = Commands.RequestWeeklyReviewCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.REQUEST_WEEKLY_REVIEW_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { weekStartedAt },
    } satisfies Commands.RequestWeeklyReviewCommandType);

    await infra.CommandBus.emit(command.name, command);
  }
}
