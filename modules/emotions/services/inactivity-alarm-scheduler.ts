import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Policies from "+emotions/policies";
import * as Queries from "+emotions/queries";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class InactivityAlarmScheduler {
  static cron = `0 18 * * ${bg.UTC_DAY_OF_THE_WEEK.Wednesday}`; // 18:00 UTC

  static label = "InactivityAlarmSchedulerJob";

  static async process() {
    const userIds = await Auth.Repos.UserRepository.listIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await Queries.GetLatestEntryTimestampForUser.execute(userId);
      await Policies.NoEntriesInTheLastWeek.perform({ lastEntryTimestamp });

      const detection: Alarms.AlarmApplicableCheckOutputType = {
        name: VO.AlarmNameOption.INACTIVITY_ALARM,
        trigger: {
          type: Alarms.AlarmTriggerEnum.inactivity,
          inactivityDays: 7,
          lastEntryTimestamp: tools.Timestamp.parse(lastEntryTimestamp),
        },
        applicable: true,
      };

      const command = Commands.GenerateAlarmCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.GENERATE_ALARM_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          alarmName: detection.name,
          trigger: detection.trigger,
          userId,
        },
      } satisfies Commands.GenerateAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
