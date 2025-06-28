import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleLogEmotionCommand = async (command: Emotions.Commands.LogEmotionCommandType) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.emotionJournalEntryId),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.emotionJournalEntryId, history);
  await entry.logEmotion(command.payload.emotion);

  await EventStore.save(entry.pullEvents());
};
