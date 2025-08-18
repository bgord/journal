import * as Emotions from "+emotions";

export const handleLogEntryCommand =
  (repo: Emotions.Ports.EntryRepositoryPort) => async (command: Emotions.Commands.LogEntryCommandType) => {
    const entry = Emotions.Aggregates.Entry.log(
      command.payload.entryId,
      command.payload.situation,
      command.payload.emotion,
      command.payload.reaction,
      command.payload.language,
      command.payload.userId,
      command.payload.origin,
    );

    await repo.save(entry);
  };
