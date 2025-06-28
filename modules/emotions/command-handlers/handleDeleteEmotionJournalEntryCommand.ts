import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleDeleteEmotionJournalEntryCommand = async (
  command: Emotions.Commands.DeleteEmotionJournalEntryCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.emotionJournalEntryId),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.emotionJournalEntryId, history);
  await entry.delete();

  await EventStore.save(entry.pullEvents());
};
