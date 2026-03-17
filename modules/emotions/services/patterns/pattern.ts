import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";

export type PatternDetectionEventType =
  | Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType
  | Events.MaladaptiveReactionsPatternDetectedEventType
  | Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType
  | Events.LowCopingEffectivenessPatternDetectedEventType;

export enum PatternKindOptions {
  /** @public */
  positive = "positive",
  negative = "negative",
}

export abstract class Pattern {
  abstract name: VO.PatternNameOption;

  abstract kind: PatternKindOptions;

  abstract week: tools.Week;

  abstract userId: Auth.VO.UserIdType;

  abstract check(entries: ReadonlyArray<VO.EntrySnapshot>): PatternDetectionEventType | null;

  getStream(): bg.EventStreamType {
    return `weekly_pattern_detection_${this.userId}_${this.week.toIsoId()}`;
  }
}
