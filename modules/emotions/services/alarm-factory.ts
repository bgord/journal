import type * as Auth from "+auth";
import * as Aggregates from "+emotions/aggregates";
import * as Policies from "+emotions/policies";
import * as Repos from "+emotions/repositories";
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
    // TODO: Clean up policies per trigger type
    if (trigger.type === Alarms.AlarmTriggerEnum.entry) {
      const dailyAlarmsCount = await Repos.AlarmRepository.getCreatedTodayCountFor(requesterId);
      const entryAlarmsCount = await Repos.AlarmRepository.getCreatedPerEntryId(trigger.entryId);

      await Policies.DailyAlarmLimit.perform({ count: dailyAlarmsCount });
      await Policies.EntryAlarmLimit.perform({ count: entryAlarmsCount });

      const alarmId = bg.NewUUID.generate();
      const alarm = Aggregates.Alarm.create(alarmId);

      await alarm._generate(trigger, alarmName, requesterId);
      await EventStore.save(alarm.pullEvents());
    }
  }
}
