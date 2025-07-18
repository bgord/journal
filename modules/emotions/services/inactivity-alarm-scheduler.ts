import * as Auth from "+auth";
// import * as Commands from "+emotions/commands";
// import * as VO from "+emotions/value-objects";
// import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
// import * as tools from "@bgord/tools";

export class InactivityAlarmScheduler {
  static cron = `0 18 * * ${bg.UTC_DAY_OF_THE_WEEK.Wednesday}`; // 18:00 UTC

  static label = "InactivityAlarmSchedulerJob";

  static async process() {
    await Auth.Repos.UserRepository.listIds();
  }
}
