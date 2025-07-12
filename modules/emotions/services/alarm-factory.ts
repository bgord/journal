import * as Aggregates from "+emotions/aggregates";
import * as Policies from "+emotions/policies";
import * as Repos from "+emotions/repositories";
import * as VO from "+emotions/value-objects";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";

export class AlarmFactory {
  static async create(alarmName: VO.AlarmNameType, entryId: VO.EntryIdType) {
    const count = await Repos.AlarmRepository.getCreatedTodayCount();

    await Policies.DailyAlarmLimit.perform({ count });

    const alarmId = bg.NewUUID.generate();
    const alarm = Aggregates.Alarm.create(alarmId);

    await alarm._generate(entryId, alarmName);

    await EventStore.save(alarm.pullEvents());
  }
}
