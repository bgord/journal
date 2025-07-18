import * as Auth from "+auth";
import * as bg from "@bgord/bun";

export class InactivityAlarmScheduler {
  static cron = `0 18 * * ${bg.UTC_DAY_OF_THE_WEEK.Wednesday}`; // 18:00 UTC

  static label = "InactivityAlarmSchedulerJob";

  static async process() {
    const userIds = await Auth.Repos.UserRepository.listIds();
  }
}
