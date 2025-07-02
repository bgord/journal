import * as Emotions from "+emotions";
import { EventStore } from "+infra";

export const handleLogSituationCommand = async (command: Emotions.Commands.LogSituationCommandType) => {
  const entry = Emotions.Aggregates.EmotionJournalEntry.create(command.payload.emotionJournalEntryId);
  await entry.logSituation(command.payload.situation);

  await EventStore.save(entry.pullEvents());
};
