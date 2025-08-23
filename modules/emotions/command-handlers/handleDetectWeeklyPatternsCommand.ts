import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent =
  | Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType
  | Emotions.Events.LowCopingEffectivenessPatternDetectedEventType
  | Emotions.Events.MaladaptiveReactionsPatternDetectedEventType
  | Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

export const handleDetectWeeklyPatternsCommand =
  (EventStore: bg.EventStoreLike<AcceptedEvent>, EntrySnapshot: Emotions.Ports.EntrySnapshotPort) =>
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
