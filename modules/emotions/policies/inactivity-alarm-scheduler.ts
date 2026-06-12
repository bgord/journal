import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { GenerateAlarmCommand } from "../commands/GENERATE_ALARM_COMMAND";
import { InactivityAlarmSchedule } from "../invariants/inactivity-alarm-schedule";
import { NoEntriesInTheLastWeek } from "../invariants/no-entries-in-the-last-week";
import { AlarmDetection } from "../value-objects/alarm-detection";
import { AlarmNameOption } from "../value-objects/alarm-name-option";
import { AlarmTriggerEnum } from "../value-objects/alarm-trigger";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  UserDirectoryOHQ: Auth.OHQ.UserDirectoryOHQ;
  GetLatestEntryTimestampForUserQuery: Emotions.Queries.GetLatestEntryTimestampForUser;
};

export class InactivityAlarmScheduler {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    // Stryker disable all
    if (!InactivityAlarmSchedule.passes({ timestamp: event.payload.timestamp })) return;
    // Stryker restore all

    const userIds = await this.deps.UserDirectoryOHQ.listActiveUserIds();

    for (const userId of userIds) {
      const lastEntryTimestamp = await this.deps.GetLatestEntryTimestampForUserQuery.execute(userId);

      if (
        !NoEntriesInTheLastWeek.passes({
          lastEntryTimestamp,
          now: event.payload.timestamp,
        })
      )
        continue;

      const trigger = {
        type: AlarmTriggerEnum.inactivity,
        inactivityDays: tools.Int.positive(7),
        lastEntryTimestamp: v.parse(tools.TimestampValue, lastEntryTimestamp),
      } as const;

      const detection = new AlarmDetection(trigger, AlarmNameOption.INACTIVITY_ALARM);

      const command = bg.command(GenerateAlarmCommand, { payload: { detection, userId } }, this.deps);

      await this.deps.CommandBus.emit(command);
    }
  }
}
