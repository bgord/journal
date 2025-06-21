import type * as Events from "../events";
import * as Repos from "../repositories";

export const onReactionEvaluatedEvent = async (
  event: Events.ReactionEvaluatedEventType,
) => {
  await Repos.EmotionJournalEntryRepository.evaluateReaction(event);
};
