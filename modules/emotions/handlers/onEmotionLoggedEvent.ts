import type * as Events from "../events";
import * as Repos from "../repositories";

export const onEmotionLoggedEvent = async (event: Events.EmotionLoggedEventType) => {
  await Repos.EmotionJournalEntryRepository.logEmotion(event);
};
