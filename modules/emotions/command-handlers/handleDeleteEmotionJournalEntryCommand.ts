import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleDeleteEmotionJournalEntryCommand = async (
  command: Emotions.Commands.DeleteEmotionJournalEntryCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.Entry.events,
    Emotions.Aggregates.Entry.getStream(command.payload.emotionJournalEntryId),
  );

  const entry = Emotions.Aggregates.Entry.build(command.payload.emotionJournalEntryId, history);
  await entry.delete();

  await EventStore.save(entry.pullEvents());
};
