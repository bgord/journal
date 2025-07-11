import * as Aggregates from "+emotions/aggregates";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class MoreNegativeThanPositiveEmotionsPattern extends Patterns.Pattern {
  name = "MoreNegativeThanPositiveEmotionsPattern";

  kind = Patterns.PatternKindOptions.negative;

  constructor(public dateRange: Patterns.PatternDateRange) {
    super();
  }

  check(entries: Aggregates.Entry[]): Patterns.PatternDetectionEventType | null {
    const summaries = entries.map((entry) => entry.summarize());

    const positiveEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isPositive()).length;

    const negativeEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isNegative()).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      } satisfies Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType);
    }
    return null;
  }
}
