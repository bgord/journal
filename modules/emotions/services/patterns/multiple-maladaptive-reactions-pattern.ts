import * as Auth from "+auth";
import * as Aggregates from "+emotions/aggregates";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class MultipleMaladaptiveReactionsPattern extends Patterns.Pattern {
  name = "MultipleMaladaptiveReactionsPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.Entry[], userId: Auth.VO.UserIdType): Patterns.PatternDetectionEventType | null {
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
        payload: { userId, weekStartedAt: tools.Timestamp.parse(new Date(this.dateRange[0]).getTime()) },
      } satisfies Events.MultipleMaladaptiveReactionsPatternDetectedEventType);
    }
    return null;
  }
}
