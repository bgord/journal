import * as bg from "@bgord/bun";
import { EventStore } from "../../../infra/event-store";
import { Alarm } from "../aggregates/alarm";
import type * as Events from "../events";
import * as Repos from "../repositories";
import { AlarmGenerator } from "../services/alarm-generator";
import { NegativeEmotionExtremeIntensityAlarm } from "../services/alarms";

export const onEmotionReappraisedEvent = async (event: Events.EmotionReappraisedEventType) => {
  await Repos.EmotionJournalEntryRepository.reappraiseEmotion(event);

  const detection = AlarmGenerator.detect({
    event,
    alarms: [NegativeEmotionExtremeIntensityAlarm],
  });

  if (!detection) return;

  const alarmId = bg.NewUUID.generate();
  const emotionJournalEntryId = event.payload.id;

  const alarm = Alarm.create(alarmId);

  await alarm.generate(emotionJournalEntryId, detection.name);

  const events = alarm.pullEvents();
  await EventStore.save(events);
};
