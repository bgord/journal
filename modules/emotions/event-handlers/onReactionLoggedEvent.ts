import * as Emotions from "../";

export const onReactionLoggedEvent = async (event: Emotions.Events.ReactionLoggedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.logReaction(event);
};
