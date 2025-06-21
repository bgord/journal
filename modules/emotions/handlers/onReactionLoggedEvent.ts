import type * as Events from "../events";
import * as Repos from "../repositories";

export const onReactionLoggedEvent = async (
  event: Events.ReactionLoggedEventType,
) => {
  await Repos.EmotionJournalEntryRepository.logReaction(event);
};
