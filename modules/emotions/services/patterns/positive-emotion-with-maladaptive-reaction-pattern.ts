import * as Auth from "+auth";
import type * as Aggregates from "+emotions/aggregates";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class PositiveEmotionWithMaladaptiveReactionPattern extends Patterns.Pattern {
  name = "PositiveEmotionWithMaladaptiveReactionPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.Entry[], userId: Auth.VO.UserIdType): Patterns.PatternDetectionEventType | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.emotion?.label.isPositive())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: { userId },
      } satisfies Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType);
    }

    return null;
  }
}
