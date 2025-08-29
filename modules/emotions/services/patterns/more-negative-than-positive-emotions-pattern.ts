import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";

/** @public */
export class MoreNegativeThanPositiveEmotionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    private readonly IdProvider: bg.IdProviderPort,
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: VO.EntrySnapshot[]): Patterns.PatternDetectionEventType | null {
    const positiveEmotionsCounter = entries.filter((entry) =>
      new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion).isPositive(),
    ).length;

    const negativeEmotionsCounter = entries.filter((entry) =>
      new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion).isNegative(),
    ).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        ...bg.createEventEnvelope(this.IdProvider, this.getStream()),
        name: Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        payload: { userId: this.userId, weekIsoId: this.week.toIsoId(), name: this.name },
      } satisfies Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType);
    }
    return null;
  }
}
