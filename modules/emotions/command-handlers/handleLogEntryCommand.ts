import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleLogEntryCommand = async (command: Emotions.Commands.LogEntryCommandType) => {
  const entry = Emotions.Aggregates.Entry.create(command.payload.entryId);

  await entry.logSituation(command.payload.situation);
  await entry.logEmotion(command.payload.emotion);
  await entry.logReaction(command.payload.reaction);

  await EventStore.save(entry.pullEvents());
};
