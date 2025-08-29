import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";

/** @public */
export class MaladaptiveReactionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MaladaptiveReactionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    private readonly IdProvider: bg.IdProviderPort,
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
  ) {
    super();
  }

  check(entries: VO.EntrySnapshot[]): Patterns.PatternDetectionEventType | null {
    const matches = entries.filter((entry) =>
      new VO.ReactionType(entry.reactionType as VO.GrossEmotionRegulationStrategy).isMaladaptive(),
    );

    if (matches.length >= 3) {
      return Events.MaladaptiveReactionsPatternDetectedEvent.parse({
        ...bg.createEventEnvelope(this.IdProvider, this.getStream()),
        name: Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
        payload: {
          userId: this.userId,
          weekIsoId: this.week.toIsoId(),
          entryIds: matches.map((entry) => entry.id),
          name: this.name,
        },
      } satisfies Events.MaladaptiveReactionsPatternDetectedEventType);
    }
    return null;
  }
}
