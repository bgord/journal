import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

/** @public */
export class MultipleMaladaptiveReactionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MultipleMaladaptiveReactionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: Schema.SelectEntries[]): Patterns.PatternDetectionEventType | null {
    const matches = entries.filter((entry) =>
      new VO.ReactionType(entry.reactionType as VO.GrossEmotionRegulationStrategy).isMaladaptive(),
    );

    if (matches.length >= 3) {
      return Events.MultipleMaladaptiveReactionsPatternDetectedEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {
          userId: this.userId,
          weekIsoId: this.week.toIsoId(),
          entryIds: matches.map((entry) => entry.id),
          name: this.name,
        },
      } satisfies Events.MultipleMaladaptiveReactionsPatternDetectedEventType);
    }
    return null;
  }
}
