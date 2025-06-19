import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import { Pattern, PatternDateRange, PatternDetectionEventType } from "./pattern";

export class MultipleMaladaptiveReactionsPattern extends Pattern {
  name = "MultipleMaladaptiveReactionsPattern";

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): PatternDetectionEventType | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return Events.MultipleMaladaptiveReactionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }
    return null;
  }
}
