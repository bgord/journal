import * as Emotions from "+emotions";

export const onReactionEvaluatedEvent = async (event: Emotions.Events.ReactionEvaluatedEventType) => {
  await Emotions.Repos.EntryRepository.evaluateReaction(event);
};
