import * as bg from "@bgord/bun";
import * as infra from "../../../infra/logger";
import * as Events from "../events";
import * as Repos from "../repositories";

const EventHandler = new bg.EventHandler(infra.logger);

export const onEmotionJournalEntryDeletedEvent =
  EventHandler.handle<Events.EmotionJournalEntryDeletedEventType>(async (event) => {
    await Repos.EmotionJournalEntryRepository.deleteEntry(event);
  });
