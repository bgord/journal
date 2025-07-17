import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleLogEntryCommand = async (command: Emotions.Commands.LogEntryCommandType) => {
  const entry = Emotions.Aggregates.Entry.create(command.payload.entryId);

  await entry.log(
    command.payload.situation,
    command.payload.emotion,
    command.payload.reaction,
    command.payload.language,
    command.payload.userId,
  );

  await EventStore.save(entry.pullEvents());
};
