import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import * as Patterns from "./pattern";

/** @public */
export class LowCopingEffectivenessPattern extends Patterns.Pattern {
  name = "LowCopingEffectivenessPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): Patterns.PatternDetectionEventType | null {
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
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        stream: this.getStream(),
        name: Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
        version: 1,
        payload: {},
      } satisfies Events.LowCopingEffectivenessPatternDetectedEventType);
    }

    return null;
  }
}
