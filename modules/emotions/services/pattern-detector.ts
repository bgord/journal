import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Patterns from "+emotions/services/patterns";
import type * as VO from "+emotions/value-objects";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

type PatternDetectorConfigType = {
  userId: Auth.VO.UserIdType;
  entries: ReadonlyArray<VO.EntrySnapshot>;
  patterns: ReadonlyArray<tools.Constructor<Patterns.Pattern>>;
  week: tools.Week;
};

/** @public */
export class PatternDetector {
  constructor(private readonly deps: Dependencies) {}

  detect(config: PatternDetectorConfigType): ReadonlyArray<Patterns.PatternDetectionEventType> {
    return config.patterns
      .map((Pattern) => new Pattern(config.week, config.userId, this.deps).check(config.entries))
      .filter((result) => result !== null);
  }
}
