import type * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { PatternDetector } from "../services/pattern-detector";
import * as Patterns from "../services/patterns";

type AcceptedEvent =
  | Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType
  | Emotions.Events.LowCopingEffectivenessPatternDetectedEventType
  | Emotions.Events.MaladaptiveReactionsPatternDetectedEventType
  | Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleDetectWeeklyPatternsCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.DetectWeeklyPatternsCommandType) => {
    const entries = await deps.EntrySnapshot.getByWeekForUser(command.payload.week, command.payload.userId);

    const patterns = new PatternDetector(deps).detect({
      entries,
      week: command.payload.week,
      userId: command.payload.userId,
      patterns: [
        Patterns.LowCopingEffectivenessPattern,
        Patterns.MoreNegativeThanPositiveEmotionsPattern,
        Patterns.MaladaptiveReactionsPattern,
        Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
      ],
    });

    await deps.EventStore.save(patterns);
  };
