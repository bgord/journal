import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleDetectWeeklyPatternsCommand = async (
  command: Emotions.Commands.DetectWeeklyPatternsCommandType,
) => {
  const entries = await Emotions.Repos.EntryRepository.findInWeek(command.payload.week);

  const patterns = Emotions.Services.PatternDetector.detect({
    entries,
    week: command.payload.week,
    userId: command.payload.userId,
    patterns: [
      Emotions.Services.Patterns.LowCopingEffectivenessPattern,
      Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern,
      Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern,
      Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
    ],
  });

  await EventStore.save(patterns);
};
