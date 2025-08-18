import type * as Emotions from "+emotions";

export const handleDeleteEntryCommand =
  (repo: Emotions.Ports.EntryRepositoryPort) => async (command: Emotions.Commands.DeleteEntryCommandType) => {
    const entry = await repo.load(command.payload.entryId);
    command.revision.validate(entry.revision.value);
    entry.delete(command.payload.userId);
    await repo.save(entry);
  };
