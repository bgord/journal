import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleEvaluateReactionCommand = async (
  command: Emotions.Commands.EvaluateReactionCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.emotionJournalEntryId),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.emotionJournalEntryId, history);
  await entry.evaluateReaction(command.payload.newReaction);

  await EventStore.save(entry.pullEvents());
};
