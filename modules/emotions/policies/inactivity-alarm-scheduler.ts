import * as Events from "+app/events";
import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Invariants from "+emotions/invariants";
import * as Queries from "+emotions/queries";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class InactivityAlarmScheduler {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Events.HOUR_HAS_PASSED_EVENT, this.onHourHasPassed.bind(this));
  }

  async onHourHasPassed(_event: Events.HourHasPassedEventType) {
    const userIds = await Auth.Repos.UserRepository.listIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await Queries.GetLatestEntryTimestampForUser.execute(userId);

      if (Invariants.NoEntriesInTheLastWeek.fails({ lastEntryTimestamp })) continue;

      const trigger = {
        type: VO.AlarmTriggerEnum.inactivity,
        inactivityDays: 7,
        lastEntryTimestamp: tools.Timestamp.parse(lastEntryTimestamp),
      } as const;

      const detection = new VO.AlarmDetection(trigger, VO.AlarmNameOption.INACTIVITY_ALARM);

      const command = Commands.GenerateAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.GENERATE_ALARM_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { detection, userId },
      } satisfies Commands.GenerateAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
