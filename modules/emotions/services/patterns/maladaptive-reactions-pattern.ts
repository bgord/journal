import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Patterns from "+emotions/services/patterns";
import * as VO from "+emotions/value-objects";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

/** @public */
export class MaladaptiveReactionsPattern extends Patterns.Pattern {
  name = VO.PatternNameOption.MaladaptiveReactionsPattern;

  kind = Patterns.PatternKindOptions.negative;

  constructor(
    public week: tools.Week,
    public userId: Auth.VO.UserIdType,
    private readonly deps: Dependencies,
  ) {
    super();
  }

  check(entries: ReadonlyArray<VO.EntrySnapshot>): Patterns.PatternDetectionEventType | null {
    const matches = entries.filter(
      (entry) => entry.reactionType && new VO.ReactionType(entry.reactionType).isMaladaptive(),
    );

    if (matches.length >= 3) {
      return Events.MaladaptiveReactionsPatternDetectedEvent.parse({
        ...bg.createEventEnvelope(this.getStream(), this.deps),
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
