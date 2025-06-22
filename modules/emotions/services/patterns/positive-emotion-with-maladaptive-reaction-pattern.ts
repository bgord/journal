import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import type * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import * as Patterns from "./pattern";

/** @public */
export class PositiveEmotionWithMaladaptiveReactionPattern extends Patterns.Pattern {
  name = "PositiveEmotionWithMaladaptiveReactionPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): Patterns.PatternDetectionEventType | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.emotion?.label.isPositive())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }

    return null;
  }
}
