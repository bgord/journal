import * as bg from "@bgord/bun";

import { EventStore } from "../../../infra/event-store";

import { Alarm } from "../aggregates/alarm";
import * as Policies from "../policies";
import * as Repos from "../repositories";
import { AlarmApplicableCheckOutputType } from "../services/alarms";
import * as VO from "../value-objects";

export class AlarmCreator {
  static async create(
    detection: AlarmApplicableCheckOutputType,
    emotionJournalEntryId: VO.EmotionJournalEntryIdType,
  ) {
    const count = await Repos.AlarmRepository.getCreatedTodayCount();

    await Policies.DailyAlarmLimit.perform({ count });

    const alarmId = bg.NewUUID.generate();
    const alarm = Alarm.create(alarmId);

    await alarm._generate(emotionJournalEntryId, detection.name);

    const events = alarm.pullEvents();
    await EventStore.save(events);
  }
}
