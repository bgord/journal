import * as bg from "@bgord/bun";

import { EventStore } from "../../../infra/event-store";

import { Alarm } from "../aggregates/alarm";
import * as Policies from "../policies";
import * as Repos from "../repositories";
import * as VO from "../value-objects";

export class AlarmFactory {
  static async create(alarmName: VO.AlarmNameType, emotionJournalEntryId: VO.EmotionJournalEntryIdType) {
    const count = await Repos.AlarmRepository.getCreatedTodayCount();

    await Policies.DailyAlarmLimit.perform({ count });

    const alarmId = bg.NewUUID.generate();
    const alarm = Alarm.create(alarmId);

    await alarm._generate(emotionJournalEntryId, alarmName);

    await EventStore.save(alarm.pullEvents());
  }
}
