import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as System from "+system";
import type * as Buses from "+app/ports";
import { createCommandEnvelope } from "../../../base";

type AcceptedEvent = System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

export class InactivityAlarmScheduler {
  constructor(
    EventBus: Buses.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<AcceptedCommand>,
    private readonly userDirectory: Auth.OHQ.UserDirectoryOHQ,
    private readonly getLatestEntryTimestampForUser: Emotions.Queries.GetLatestEntryTimestampForUser,
  ) {
    EventBus.on(System.Events.HOUR_HAS_PASSED_EVENT, EventHandler.handle(this.onHourHasPassed.bind(this)));
  }

  async onHourHasPassed(event: System.Events.HourHasPassedEventType) {
    if (Emotions.Invariants.InactivityAlarmSchedule.fails({ timestamp: event.payload.timestamp })) return;

    const userIds = await this.userDirectory.listActiveUserIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await this.getLatestEntryTimestampForUser.execute(userId);

      if (Emotions.Invariants.NoEntriesInTheLastWeek.fails({ lastEntryTimestamp })) continue;

      const trigger = {
        type: Emotions.VO.AlarmTriggerEnum.inactivity,
        inactivityDays: 7,
        lastEntryTimestamp: tools.Timestamp.parse(lastEntryTimestamp),
      } as const;

      const detection = new Emotions.VO.AlarmDetection(trigger, Emotions.VO.AlarmNameOption.INACTIVITY_ALARM);

      const command = Emotions.Commands.GenerateAlarmCommand.parse({
        ...createCommandEnvelope(),
        name: Emotions.Commands.GENERATE_ALARM_COMMAND,
        payload: { detection, userId },
      } satisfies Emotions.Commands.GenerateAlarmCommandType);

      await this.CommandBus.emit(command.name, command);
    }
  }
}
