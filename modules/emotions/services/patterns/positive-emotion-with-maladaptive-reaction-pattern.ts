import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

/** @public */
export class PositiveEmotionWithMaladaptiveReactionPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.PositiveEmotionWithMaladaptiveReactionPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: Schema.SelectEntries[]): Patterns.PatternDetectionEventType | null {
    const matches = entries
      .map((entry) => ({
        id: entry.id,
        emotionLabel: new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion),
        reactionType: new VO.ReactionType(entry.reactionType as VO.GrossEmotionRegulationStrategy),
      }))
      .filter((entry) => entry.emotionLabel.isPositive())
      .filter((entry) => entry.reactionType.isMaladaptive());

    if (matches.length >= 3) {
      return Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Time.Now().value,
        name: Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {
          userId: this.userId,
          weekIsoId: this.week.toIsoId(),
          entryIds: matches.map((entry) => entry.id),
          name: this.name,
        },
      } satisfies Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType);
    }

    return null;
  }
}
