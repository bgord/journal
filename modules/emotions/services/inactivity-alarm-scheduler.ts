import * as Auth from "+auth";
import * as Policies from "+emotions/policies";
// import * as Commands from "+emotions/commands";
// import * as VO from "+emotions/queries";
import * as Queries from "+emotions/queries";
import * as bg from "@bgord/bun";

export class InactivityAlarmScheduler {
  static cron = `0 18 * * ${bg.UTC_DAY_OF_THE_WEEK.Wednesday}`; // 18:00 UTC

  static label = "InactivityAlarmSchedulerJob";

  static async process() {
    const userIds = await Auth.Repos.UserRepository.listIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await Queries.GetLatestEntryTimestampForUser.execute(userId);
      await Policies.NoEntriesInTheLastWeek.perform({ lastEntryTimestamp });
    }
  }
}
