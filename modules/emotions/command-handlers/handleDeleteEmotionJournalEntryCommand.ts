import * as Emotions from "../";
import { EventStore } from "../../../infra";

export const handleDeleteEmotionJournalEntryCommand = async (
  command: Emotions.Commands.DeleteEmotionJournalEntryCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.id),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.id, history);
  await entry.delete();

  await EventStore.save(entry.pullEvents());
};
