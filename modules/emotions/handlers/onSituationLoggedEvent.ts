import type * as Events from "../events";
import * as Repos from "../repositories";

export const onSituationLoggedEvent = async (
  event: Events.SituationLoggedEventType,
) => {
  await Repos.EmotionJournalEntryRepository.logSituation(event);
};
