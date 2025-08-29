import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type Dependencies = { repo: Emotions.Ports.EntryRepositoryPort; IdProvider: bg.IdProviderPort };

export const handleLogEntryCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.LogEntryCommandType) => {
    const entry = Emotions.Aggregates.Entry.log(
      command.payload.entryId,
      command.payload.situation,
      command.payload.emotion,
      command.payload.reaction,
      command.payload.userId,
      command.payload.origin,
      { IdProvider: deps.IdProvider },
    );

    await deps.repo.save(entry);
  };
