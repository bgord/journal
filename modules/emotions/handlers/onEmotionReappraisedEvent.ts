import type * as Events from "../events";
import * as Repos from "../repositories";

export const onEmotionReappraisedEvent = async (
  event: Events.EmotionReappraisedEventType,
) => {
  await Repos.EmotionJournalEntryRepository.reappraiseEmotion(event);
};
