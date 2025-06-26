import type * as Events from "../events";
import * as Repos from "../repositories";
import { AlarmCreator, AlarmDetector } from "../services";
import { NegativeEmotionExtremeIntensityAlarm } from "../services/alarms";

export const onEmotionReappraisedEvent = async (event: Events.EmotionReappraisedEventType) => {
  await Repos.EmotionJournalEntryRepository.reappraiseEmotion(event);

  const detection = AlarmDetector.detect({
    event,
    alarms: [NegativeEmotionExtremeIntensityAlarm],
  });

  if (!detection) return;

  await AlarmCreator.create(detection, event.payload.id);
};
