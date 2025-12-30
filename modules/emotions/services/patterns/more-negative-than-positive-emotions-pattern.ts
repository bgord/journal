import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

/** @public */
export class MoreNegativeThanPositiveEmotionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
    private readonly deps: Dependencies,
  ) {
    super();
  }

  check(entries: VO.EntrySnapshot[]): Patterns.PatternDetectionEventType | null {
    const positiveEmotionsCounter = entries.filter(
      (entry) => entry.emotionLabel && new VO.EmotionLabel(entry.emotionLabel).isPositive(),
    ).length;

    const negativeEmotionsCounter = entries.filter(
      (entry) => entry.emotionLabel && new VO.EmotionLabel(entry.emotionLabel).isNegative(),
    ).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        ...bg.createEventEnvelope(this.getStream(), this.deps),
        name: Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        payload: { userId: this.userId, weekIsoId: this.week.toIsoId(), name: this.name },
      } satisfies Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType);
    }
    return null;
  }
}
