import * as Auth from "+auth";
import type * as Aggregates from "+emotions/aggregates";
import type * as Events from "+emotions/events";
import * as tools from "@bgord/tools";
import type { z } from "zod/v4";

type PatternName = string;

export type PatternDetectionEvent =
  | typeof Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent
  | typeof Events.MultipleMaladaptiveReactionsPatternDetectedEvent
  | typeof Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
  | typeof Events.LowCopingEffectivenessPatternDetectedEvent;

export type PatternDetectionEventType = z.infer<PatternDetectionEvent>;

export enum PatternKindOptions {
  /** @public */
  positive = "positive",
  negative = "negative",
}

export abstract class Pattern {
  abstract name: PatternName;

  abstract kind: PatternKindOptions;

  abstract week: tools.Week;

  abstract check(entries: Aggregates.Entry[], userId: Auth.VO.UserIdType): PatternDetectionEventType | null;

  getStream(): string {
    return `weekly_pattern_detection_${this.week.toIsoId()}`;
  }
}
