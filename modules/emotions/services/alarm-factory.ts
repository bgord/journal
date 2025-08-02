import type * as Auth from "+auth";
import * as Aggregates from "+emotions/aggregates";
import * as Policies from "+emotions/policies";
import * as Queries from "+emotions/queries";
import * as VO from "+emotions/value-objects";
import { EventStore } from "+infra/event-store";

export class AlarmFactory {
  static async create(detection: VO.AlarmDetection, requesterId: Auth.VO.UserIdType) {
    const alarmsTodayForUserCount = await Queries.CountTodaysAlarmsForUser.execute(requesterId);
    Policies.DailyAlarmLimit.perform(alarmsTodayForUserCount);

    switch (detection.trigger.type) {
      case VO.AlarmTriggerEnum.entry: {
        const entryAlarmsCount = await Queries.CountAlarmsForEntry.execute(detection.trigger.entryId);
        Policies.EntryAlarmLimit.perform({ count: entryAlarmsCount });

        break;
      }

      case VO.AlarmTriggerEnum.inactivity:
        break;
    }

    const alarmId = crypto.randomUUID();
    const alarm = Aggregates.Alarm.generate(alarmId, detection, requesterId);

    await EventStore.save(alarm.pullEvents());
  }
}
