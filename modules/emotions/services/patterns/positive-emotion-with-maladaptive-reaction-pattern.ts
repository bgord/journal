import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

/** @public */
export class PositiveEmotionWithMaladaptiveReactionPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.PositiveEmotionWithMaladaptiveReactionPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
    private readonly deps: Dependencies,
  ) {
    super();
  }

  check(entries: ReadonlyArray<VO.EntrySnapshot>): Patterns.PatternDetectionEventType | null {
    const matches = entries
      .flatMap((entry) => {
        if (!(entry.emotionLabel && entry.reactionType)) return [];
        return [
          {
            id: entry.id,
            emotionLabel: new VO.EmotionLabel(entry.emotionLabel),
            reactionType: new VO.ReactionType(entry.reactionType),
          },
        ];
      })
      .filter((entry) => entry.emotionLabel.isPositive())
      .filter((entry) => entry.reactionType.isMaladaptive());

    if (matches.length >= 3) {
      return bg.event(
        Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
        this.getStream(),
        {
          userId: this.userId,
          weekIsoId: this.week.toIsoId(),
          entryIds: matches.map((entry) => entry.id),
          name: this.name,
        },
        this.deps,
      );
    }

    return null;
  }
}
