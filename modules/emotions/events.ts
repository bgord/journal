import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "./value-objects";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";
export const SituationLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SITUATION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
  }),
});
export type SituationLoggedEventType = z.infer<typeof SituationLoggedEvent>;

export const EMOTION_LOGGED_EVENT = "EMOTION_LOGGED_EVENT";
export const EmotionLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    label: VO.EmotionLabelSchema,
    intensity: VO.EmotionIntensitySchema,
  }),
});
export type EmotionLoggedEventType = z.infer<typeof EmotionLoggedEvent>;

export const REACTION_LOGGED_EVENT = "REACTION_LOGGED_EVENT";
export const ReactionLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});
export type ReactionLoggedEventType = z.infer<typeof ReactionLoggedEvent>;

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";
export const EmotionReappraisedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_REAPPRAISED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
  }),
});
export type EmotionReappraisedEventType = z.infer<typeof EmotionReappraisedEvent>;

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";
export const ReactionEvaluatedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_EVALUATED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});
export type ReactionEvaluatedEventType = z.infer<typeof ReactionEvaluatedEvent>;

export const MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT =
  "MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT";
export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});
export type MoreNegativeThanPositiveEmotionsPatternDetectedEventType = z.infer<
  typeof MoreNegativeThanPositiveEmotionsPatternDetectedEvent
>;

export const MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT =
  "MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT";
export const MultipleMaladaptiveReactionsPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});
export type MultipleMaladaptiveReactionsPatternDetectedEventType = z.infer<
  typeof MultipleMaladaptiveReactionsPatternDetectedEvent
>;

export const POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT =
  "POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT";
export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});
export type PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType = z.infer<
  typeof PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
>;
