import { Form as form } from "@bgord/ui";
import * as EmotionIntensity from "../../modules/emotions/value-objects/emotion-intensity.validation";
import * as EmotionLabel from "../../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import * as ReactionType from "../../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";
import * as ReactionDescription from "../../modules/emotions/value-objects/reaction-description.validation";
import * as ReactionEffectiveness from "../../modules/emotions/value-objects/reaction-effectiveness.validation";
import * as SituationDescription from "../../modules/emotions/value-objects/situation-description.validation";
import * as SituationKind from "../../modules/emotions/value-objects/situation-kind-options";

export const Form = {
  schedueldFor: { field: { name: "scheduledFor", defaultValue: form.date.min.tomorrow() } },
  scheduledForHour: {
    field: { name: "scheduledForHour", defaultValue: "0" },
    options: Array.from({ length: 24 }).map((_, index) => ({
      value: index.toString(),
      label: `${index.toString().padStart(2, "0")}:00`,
    })),
  },
  situationDescription: {
    pattern: {
      min: SituationDescription.SituationDescriptionMin,
      max: SituationDescription.SituationDescriptionMax,
    },
    field: { name: "situationDescription" },
  },
  situationKind: {
    options: Object.keys(SituationKind.SituationKindOptions),
    field: { name: "situationKind" },
  },
  emotionIntensity: {
    pattern: { min: EmotionIntensity.EmotionIntensityMin, max: EmotionIntensity.EmotionIntensityMax },
    field: { name: "emotionIntensity", defaultValue: EmotionIntensity.EmotionIntensityMin },
  },
  emotionLabel: {
    positive: EmotionLabel.PositiveEmotions,
    negative: EmotionLabel.NegativeEmotions,
    options: Object.keys(EmotionLabel.GenevaWheelEmotion),
    field: { name: "emotionLabel" },
  },
  reactionDescription: {
    pattern: {
      min: ReactionDescription.ReactionDescriptionMin,
      max: ReactionDescription.ReactionDescriptionMax,
    },
    field: { name: "reactionDescription" },
  },
  reactionType: {
    options: Object.keys(ReactionType.GrossEmotionRegulationStrategy),
    field: { name: "reactionType" },
  },
  reactionEffectiveness: {
    pattern: {
      min: ReactionEffectiveness.ReactionEffectivenessMin,
      max: ReactionEffectiveness.ReactionEffectivenessMax,
    },
    min: ReactionEffectiveness.ReactionEffectivenessMin,
    max: ReactionEffectiveness.ReactionEffectivenessMax,
    field: { name: "reactionEffectiveness", defaultValue: ReactionEffectiveness.ReactionEffectivenessMin },
  },
};

export type * as types from "../../modules/emotions/value-objects";
