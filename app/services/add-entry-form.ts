import { EmotionIntensity } from "../../modules/emotions/value-objects/emotion-intensity";
import { EmotionLabel } from "../../modules/emotions/value-objects/emotion-label";
import { ReactionDescription } from "../../modules/emotions/value-objects/reaction-description";
import { ReactionEffectiveness } from "../../modules/emotions/value-objects/reaction-effectiveness";
import { ReactionType } from "../../modules/emotions/value-objects/reaction-type";
import { SituationDescription } from "../../modules/emotions/value-objects/situation-description";
import { SituationKind } from "../../modules/emotions/value-objects/situation-kind";

export type * as types from "../../modules/emotions/value-objects";

/** @public */
export class AddEntryForm {
  static get() {
    return {
      situationDescription: {
        min: SituationDescription.MinimumLength,
        max: SituationDescription.MaximumLength,
      },
      situationKinds: SituationKind.all(),
      emotionLabels: EmotionLabel.all(),
      emotionIntensity: {
        min: EmotionIntensity.Minimum,
        max: EmotionIntensity.Maximum,
      },
      reactionDescription: {
        min: ReactionDescription.MinimumLength,
        max: ReactionDescription.MaximumLength,
      },
      reactionTypes: ReactionType.all(),
      reactionEffectiveness: {
        min: ReactionEffectiveness.Minimum,
        max: ReactionEffectiveness.Maximum,
      },
    };
  }
}
