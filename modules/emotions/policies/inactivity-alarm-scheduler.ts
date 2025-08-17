import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as Events from "+app/events";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";

export class InactivityAlarmScheduler {
  constructor(
    eventBus: typeof EventBus,
    EventHandler: bg.EventHandler,
    private readonly userDirectory: Auth.Ports.UserDirectoryPort,
  ) {
    eventBus.on(Events.HOUR_HAS_PASSED_EVENT, EventHandler.handle(this.onHourHasPassed.bind(this)));
  }

  async onHourHasPassed(event: Events.HourHasPassedEventType) {
    if (Emotions.Invariants.InactivityAlarmSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const userIds = await this.userDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await Emotions.Queries.GetLatestEntryTimestampForUser.execute(userId);

      if (Emotions.Invariants.NoEntriesInTheLastWeek.fails({ lastEntryTimestamp })) continue;

      const trigger = {
        type: Emotions.VO.AlarmTriggerEnum.inactivity,
        inactivityDays: 7,
        lastEntryTimestamp: tools.Timestamp.parse(lastEntryTimestamp),
      } as const;

      const detection = new Emotions.VO.AlarmDetection(trigger, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM);

      const command = Emotions.Commands.GenerateAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.GENERATE_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { detection, userId },
      } satisfies Emotions.Commands.GenerateAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
