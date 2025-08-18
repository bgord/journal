import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Patterns from "+emotions/services/patterns";
import type * as VO from "+emotions/value-objects";

type PatternDetectorConfigType = {
  userId: Auth.VO.UserIdType;
  entries: VO.EntrySnapshot[];
  patterns: tools.Constructor<Patterns.Pattern>[];
  week: tools.Week;
};

/** @public */
export class PatternDetector {
  static detect(config: PatternDetectorConfigType): Patterns.PatternDetectionEventType[] {
    return config.patterns
      .map((Pattern) => new Pattern(config.week, config.userId).check(config.entries))
      .filter((result) => result !== null);
  }
}
