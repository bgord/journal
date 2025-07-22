import * as Auth from "+auth";
import type * as Aggregates from "+emotions/aggregates";
import * as Patterns from "+emotions/services/patterns";
import * as tools from "@bgord/tools";

type PatternDetectorConfigType = {
  userId: Auth.VO.UserIdType;
  entries: Aggregates.Entry[];
  patterns: tools.Constructor<Patterns.Pattern>[];
  dateRange: Patterns.PatternDateRange;
};

/** @public */
export class PatternDetector {
  static detect(config: PatternDetectorConfigType): Patterns.PatternDetectionEventType[] {
    return config.patterns
      .map((Pattern) => new Pattern(config.dateRange).check(config.entries, config.userId))
      .filter((result) => result !== null);
  }
}
