import * as Emotions from "+emotions";

export const onReactionLoggedEvent = async (event: Emotions.Events.ReactionLoggedEventType) => {
  await Emotions.Repos.EntryRepository.logReaction(event);
};
