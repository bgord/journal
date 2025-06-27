import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleEvaluateReactionCommand = async (
  command: Emotions.Commands.EvaluateReactionCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.id),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.id, history);
  await entry.evaluateReaction(command.payload.newReaction);

  await EventStore.save(entry.pullEvents());
};
