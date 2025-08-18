import * as Emotions from "+emotions";

export const handleReappraiseEmotionCommand =
  (repo: Emotions.Ports.EntryRepositoryPort) =>
  async (command: Emotions.Commands.ReappraiseEmotionCommandType) => {
    const entry = await repo.load(command.payload.entryId);
    command.revision.validate(entry.revision.value);
    entry.reappraiseEmotion(command.payload.newEmotion, command.payload.userId);
    await repo.save(entry);
  };
