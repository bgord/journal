import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import { Pattern, PatternDateRange, PatternDetectionEventType, PatternKindOptions } from "./pattern";

/** @public */
export class LowCopingEffectivenessPattern extends Pattern {
  name = "LowCopingEffectivenessPattern";

  kind = PatternKindOptions.negative;

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): PatternDetectionEventType | null {
    const effectivenessScores = entries
      .map((entry) => entry.summarize())
      .flatMap((e) => (e.reaction ? [e.reaction.effectiveness.get()] : []));

    if (effectivenessScores.length < 3) {
      return null;
    }

    const mean = tools.Mean.calculate(effectivenessScores);

    if (mean < 3) {
      return Events.LowCopingEffectivenessPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        stream: this.getStream(),
        name: Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
        version: 1,
        payload: {},
      });
    }

    return null;
  }
}
