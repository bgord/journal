import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class MoreNegativeThanPositiveEmotionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: Schema.SelectEntries[]): Patterns.PatternDetectionEventType | null {
    const positiveEmotionsCounter = entries.filter((entry) =>
      new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion).isPositive(),
    ).length;

    const negativeEmotionsCounter = entries.filter((entry) =>
      new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion).isNegative(),
    ).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Time.Now().value,
        name: Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: { userId: this.userId, weekIsoId: this.week.toIsoId(), name: this.name },
      } satisfies Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType);
    }
    return null;
  }
}
