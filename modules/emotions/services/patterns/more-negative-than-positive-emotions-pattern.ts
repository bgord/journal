import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";
import * as wip from "+infra/build";

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

  check(entries: ReadonlyArray<VO.EntrySnapshot>): Patterns.PatternDetectionEventType | null {
    const positiveEmotionsCounter = entries.filter(
      (entry) => entry.emotionLabel && new VO.EmotionLabel(entry.emotionLabel).isPositive(),
    ).length;

    const negativeEmotionsCounter = entries.filter(
      (entry) => entry.emotionLabel && new VO.EmotionLabel(entry.emotionLabel).isNegative(),
    ).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return wip.event(
        Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
        this.getStream(),
        { payload: { userId: this.userId, weekIsoId: this.week.toIsoId(), name: this.name } },
        this.deps,
      );
    }
    return null;
  }
}
