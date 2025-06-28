import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleReappraiseEmotionCommand = async (
  command: Emotions.Commands.ReappraiseEmotionCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.emotionJournalEntryId),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.emotionJournalEntryId, history);
  await entry.reappraiseEmotion(command.payload.newEmotion);

  await EventStore.save(entry.pullEvents());
};
