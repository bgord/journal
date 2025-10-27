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

export const Form = {
  schedueldFor: { field: { name: "scheduledFor" } },
  situationDescription: {
    pattern: { min: SituationDescriptionMin, max: SituationDescriptionMax },
    field: { name: "situationDescription" },
  },
  situationKind: { options: Object.keys(SituationKindOptions), field: { name: "situationKind" } },
  emotionIntensity: {
    pattern: { min: EmotionIntensityMin, max: EmotionIntensityMax },
    field: { name: "emotionIntensity", defaultValue: EmotionIntensityMin },
  },
  emotionLabel: {
    positive: PositiveEmotions,
    negative: NegativeEmotions,
    options: Object.keys(GenevaWheelEmotion),
    field: { name: "emotionLabel" },
  },
  reactionDescription: {
    pattern: { min: ReactionDescriptionMin, max: ReactionDescriptionMax },
    field: { name: "reactionDescription" },
  },
  reactionType: { options: Object.keys(GrossEmotionRegulationStrategy), field: { name: "reactionType" } },
  reactionEffectiveness: {
    pattern: { min: ReactionEffectivenessMin, max: ReactionEffectivenessMax },
    min: ReactionEffectivenessMin,
    max: ReactionEffectivenessMax,
    field: {
      name: "reactionEffectiveness",
      defaultValue: ReactionDescriptionMin,
    },
  },
};

export type * as types from "../../modules/emotions/value-objects";
