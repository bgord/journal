import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns/pattern";
import * as VO from "+emotions/value-objects";

/** @public */
export class LowCopingEffectivenessPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.LowCopingEffectivenessPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: VO.EntrySnapshot[]): Patterns.PatternDetectionEventType | null {
    const effectivenessScores = entries.map((entry) =>
      new VO.ReactionEffectiveness(entry.reactionEffectiveness as VO.ReactionEffectivenessType).get(),
    );

    if (effectivenessScores.length < 3) {
      return null;
    }

    const mean = tools.Mean.calculate(effectivenessScores);

    if (mean < 3) {
      return Events.LowCopingEffectivenessPatternDetectedEvent.parse({
        ...bg.createEventEnvelope(this.getStream()),
        name: Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
        payload: { userId: this.userId, weekIsoId: this.week.toIsoId(), name: this.name },
      } satisfies Events.LowCopingEffectivenessPatternDetectedEventType);
    }

    return null;
  }
}
