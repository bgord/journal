import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleLogEntryCommand = async (command: Emotions.Commands.LogEntryCommandType) => {
  const entry = Emotions.Aggregates.Entry.log(
    command.payload.entryId,
    command.payload.situation,
    command.payload.emotion,
    command.payload.reaction,
    command.payload.language,
    command.payload.userId,
    command.payload.origin,
  );

  await EventStore.save(entry.pullEvents());
};
