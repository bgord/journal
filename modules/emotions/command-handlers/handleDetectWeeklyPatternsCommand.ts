import * as Emotions from "+emotions";
import type { EventStore as EventStoreType } from "+infra/event-store";

export const handleDetectWeeklyPatternsCommand =
  (EventStore: typeof EventStoreType, EntrySnapshot: Emotions.Ports.EntrySnapshotPort) =>
  async (command: Emotions.Commands.DetectWeeklyPatternsCommandType) => {
    const entries = await EntrySnapshot.getByWeekForUser(command.payload.week, command.payload.userId);

    const patterns = Emotions.Services.PatternDetector.detect({
      entries,
      week: command.payload.week,
      userId: command.payload.userId,
      patterns: [
        Emotions.Services.Patterns.LowCopingEffectivenessPattern,
        Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern,
        Emotions.Services.Patterns.MaladaptiveReactionsPattern,
        Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
      ],
    });

    await EventStore.save(patterns);
  };
