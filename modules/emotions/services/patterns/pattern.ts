import * as Auth from "+auth";
import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import type { z } from "zod/v4";

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
  abstract name: VO.PatternNameOption;

  abstract kind: PatternKindOptions;

  abstract week: tools.Week;

  abstract userId: Auth.VO.UserIdType;

  abstract check(entries: Schema.SelectEntries[]): PatternDetectionEventType | null;

  getStream(): string {
    return `weekly_pattern_detection_${this.userId}_${this.week.toIsoId()}`;
  }
}
