import * as Aggregates from "+emotions/aggregates";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns/pattern";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class LowCopingEffectivenessPattern extends Patterns.Pattern {
  name = "LowCopingEffectivenessPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.Entry[]): Patterns.PatternDetectionEventType | null {
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
