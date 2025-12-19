import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as System from "+system";

type AcceptedEvent = System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerPort;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  UserDirectoryOHQ: Auth.OHQ.UserDirectoryOHQ;
  GetLatestEntryTimestampForUserQuery: Emotions.Queries.GetLatestEntryTimestampForUser;
};

export class InactivityAlarmScheduler {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.InactivityAlarmSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const userIds = await this.deps.UserDirectoryOHQ.listActiveUserIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await this.deps.GetLatestEntryTimestampForUserQuery.execute(userId);

      if (
        Emotions.Invariants.NoEntriesInTheLastWeek.fails({ lastEntryTimestamp, now: event.payload.timestamp })
      )
        continue;

      const trigger = {
        type: Emotions.VO.AlarmTriggerEnum.inactivity,
        inactivityDays: 7,
        lastEntryTimestamp: tools.TimestampValue.parse(lastEntryTimestamp),
      } as const;

      const detection = new Emotions.VO.AlarmDetection(trigger, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM);

      const command = Emotions.Commands.GenerateAlarmCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Emotions.Commands.GENERATE_ALARM_COMMAND,
        payload: { detection, userId },
      } satisfies Emotions.Commands.GenerateAlarmCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    }
  }
}
