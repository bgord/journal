import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as System from "+system";

type AcceptedEvent = System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  UserDirectory: Auth.OHQ.UserDirectoryOHQ;
  GetLatestEntryTimestampForUser: Emotions.Queries.GetLatestEntryTimestampForUser;
};

export class InactivityAlarmScheduler {
  constructor(private readonly DI: Dependencies) {
    DI.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      DI.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.InactivityAlarmSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const userIds = await this.DI.UserDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await this.DI.GetLatestEntryTimestampForUser.execute(userId);

      if (Emotions.Invariants.NoEntriesInTheLastWeek.fails({ lastEntryTimestamp })) continue;

      const trigger = {
        type: Emotions.VO.AlarmTriggerEnum.inactivity,
        inactivityDays: 7,
        lastEntryTimestamp: tools.Timestamp.parse(lastEntryTimestamp),
      } as const;

      const detection = new Emotions.VO.AlarmDetection(trigger, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM);

      const command = Emotions.Commands.GenerateAlarmCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.GENERATE_ALARM_COMMAND,
        payload: { detection, userId },
      } satisfies Emotions.Commands.GenerateAlarmCommandType);

      await this.DI.CommandBus.emit(command.name, command);
    }
  }
}
