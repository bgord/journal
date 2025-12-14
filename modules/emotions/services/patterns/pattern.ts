import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { z } from "zod/v4";
import type * as Auth from "+auth";
import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";

export type PatternDetectionEvent =
  | typeof Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent
  | typeof Events.MaladaptiveReactionsPatternDetectedEvent
  | typeof Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
  | typeof Events.LowCopingEffectivenessPatternDetectedEvent;

export type PatternDetectionEventType = z.infer<PatternDetectionEvent>;

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

  abstract check(entries: VO.EntrySnapshot[]): PatternDetectionEventType | null;

  getStream(): bg.EventStreamType {
    return `weekly_pattern_detection_${this.userId}_${this.week.toIsoId()}`;
  }
}
