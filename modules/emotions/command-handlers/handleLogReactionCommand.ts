import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleLogReactionCommand = async (command: Emotions.Commands.LogReactionCommandType) => {
  const history = await EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(command.payload.id),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(command.payload.id, history);
  await entry.logReaction(command.payload.reaction);

  await EventStore.save(entry.pullEvents());
};
