import {
  EmotionIntensityMax,
  EmotionIntensityMin,
} from "../../modules/emotions/value-objects/emotion-intensity.validation";
import {
  GenevaWheelEmotion,
  NegativeEmotions,
  PositiveEmotions,
} from "../../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";
import {
  ReactionDescriptionMax,
  ReactionDescriptionMin,
} from "../../modules/emotions/value-objects/reaction-description.validation";
import {
  ReactionEffectivenessMax,
  ReactionEffectivenessMin,
} from "../../modules/emotions/value-objects/reaction-effectiveness.validation";
import {
  SituationDescriptionMax,
  SituationDescriptionMin,
} from "../../modules/emotions/value-objects/situation-description.validation";
import { SituationKindOptions } from "../../modules/emotions/value-objects/situation-kind-options";

export const HomeEntryAddForm = {
  situationDescription: { min: SituationDescriptionMin, max: SituationDescriptionMax },
  situationKind: { options: Object.keys(SituationKindOptions) },
  emotionIntensity: { min: EmotionIntensityMin, max: EmotionIntensityMax },
  emotionLabel: {
    positive: PositiveEmotions,
    negative: NegativeEmotions,
    options: Object.keys(GenevaWheelEmotion),
  },
  reactionDescription: { min: ReactionDescriptionMin, max: ReactionDescriptionMax },
  reactionType: { options: Object.keys(GrossEmotionRegulationStrategy) },
  reactionEffectiveness: { min: ReactionEffectivenessMin, max: ReactionEffectivenessMax },
};

export type * as types from "../../modules/emotions/value-objects";
