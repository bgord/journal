import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent =
  | Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType
  | Emotions.Events.LowCopingEffectivenessPatternDetectedEventType
  | Emotions.Events.MaladaptiveReactionsPatternDetectedEventType
  | Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleDetectWeeklyPatternsCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.DetectWeeklyPatternsCommandType) => {
    const entries = await deps.EntrySnapshot.getByWeekForUser(command.payload.week, command.payload.userId);

    const patterns = new Emotions.Services.PatternDetector(deps).detect({
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

    await deps.EventStore.save(patterns);
  };
