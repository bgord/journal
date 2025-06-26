import type * as Events from "../events";
import * as Repos from "../repositories";
import { AlarmCreator, AlarmGenerator } from "../services";
import { NegativeEmotionExtremeIntensityAlarm } from "../services/alarms";

export const onEmotionLoggedEvent = async (event: Events.EmotionLoggedEventType) => {
  await Repos.EmotionJournalEntryRepository.logEmotion(event);

  const detection = AlarmGenerator.detect({
    event,
    alarms: [NegativeEmotionExtremeIntensityAlarm],
  });

  if (!detection) return;

  await AlarmCreator.create(detection, event.payload.id);
};
