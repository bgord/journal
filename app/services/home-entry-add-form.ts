import {
  EmotionIntensityMax,
  EmotionIntensityMin,
} from "../../modules/emotions/value-objects/emotion-intensity.validation";
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

export type * as types from "../../modules/emotions/value-objects";

export const HomeEntryAddForm = {
  situationDescription: { min: SituationDescriptionMin, max: SituationDescriptionMax },
  emotionIntensity: { min: EmotionIntensityMin, max: EmotionIntensityMax },
  reactionEffectiveness: { min: ReactionEffectivenessMin, max: ReactionEffectivenessMax },
  reactionDescription: { min: ReactionDescriptionMax, max: ReactionDescriptionMin },
  situationKind: { options: Object.keys(SituationKindOptions) },
};
