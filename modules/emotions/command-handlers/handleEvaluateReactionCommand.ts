import type * as Emotions from "+emotions";

export const handleEvaluateReactionCommand =
  (repo: Emotions.Ports.EntryRepositoryPort) =>
  async (command: Emotions.Commands.EvaluateReactionCommandType) => {
    const entry = await repo.load(command.payload.entryId);
    command.revision.validate(entry.revision.value);
    entry.evaluateReaction(command.payload.newReaction, command.payload.userId);
    await repo.save(entry);
  };
