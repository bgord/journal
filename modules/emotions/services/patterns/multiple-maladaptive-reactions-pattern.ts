import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import * as Patterns from "./pattern";

/** @public */
export class MultipleMaladaptiveReactionsPattern extends Patterns.Pattern {
  name = "MultipleMaladaptiveReactionsPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): Patterns.PatternDetectionEventType | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return Events.MultipleMaladaptiveReactionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      } satisfies Events.MultipleMaladaptiveReactionsPatternDetectedEventType);
    }
    return null;
  }
}
