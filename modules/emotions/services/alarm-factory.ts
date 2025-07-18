import type * as Auth from "+auth";
import * as Aggregates from "+emotions/aggregates";
import * as Policies from "+emotions/policies";
import * as Queries from "+emotions/queries";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";

export class AlarmFactory {
  static async create(detection: Alarms.AlarmDetection, requesterId: Auth.VO.UserIdType) {
    switch (detection.trigger.type) {
      case VO.AlarmTriggerEnum.entry: {
        const alarmsTodayForUserCount = await Queries.CountTodaysAlarmsForUser.execute(requesterId);
        await Policies.DailyAlarmLimit.perform({ count: alarmsTodayForUserCount });

        const entryAlarmsCount = await Queries.CountAlarmsForEntry.execute(detection.trigger.entryId);
        await Policies.EntryAlarmLimit.perform({ count: entryAlarmsCount });

        break;
      }

      case VO.AlarmTriggerEnum.inactivity:
        break;
    }

    const alarmId = bg.NewUUID.generate();
    const alarm = Aggregates.Alarm.create(alarmId);

    await alarm._generate(detection, requesterId);
    await EventStore.save(alarm.pullEvents());
  }
}
