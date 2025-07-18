import type * as Auth from "+auth";
import * as Aggregates from "+emotions/aggregates";
import * as Policies from "+emotions/policies";
import * as Queries from "+emotions/queries";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";

export class AlarmFactory {
  static async create(
    alarmName: VO.AlarmNameType,
    trigger: Alarms.AlarmTriggerType,
    requesterId: Auth.VO.UserIdType,
  ) {
    await Policies.DailyAlarmLimit.perform({
      count: await Queries.CountTodaysAlarmsForUser.execute(requesterId),
    });

    // TODO: Clean up policies per trigger type
    if (trigger.type === Alarms.AlarmTriggerEnum.entry) {
      const entryAlarmsCount = await Queries.CountAlarmsForEntry.execute(trigger.entryId);

      await Policies.EntryAlarmLimit.perform({ count: entryAlarmsCount });
    }

    const alarmId = bg.NewUUID.generate();
    const alarm = Aggregates.Alarm.create(alarmId);

    await alarm._generate(trigger, alarmName, requesterId);
    await EventStore.save(alarm.pullEvents());
  }
}
