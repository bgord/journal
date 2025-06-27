import * as Emotions from "../";

export const onReactionEvaluatedEvent = async (event: Emotions.Events.ReactionEvaluatedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.evaluateReaction(event);
};
