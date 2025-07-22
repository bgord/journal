import * as Auth from "+auth";
import * as Patterns from "+emotions/services/patterns";
import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";

type PatternDetectorConfigType = {
  userId: Auth.VO.UserIdType;
  entries: Schema.SelectEntries[];
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
