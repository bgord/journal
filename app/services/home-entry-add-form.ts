import {
  SituationDescriptionMax,
  SituationDescriptionMin,
} from "../../modules/emotions/value-objects/situation-description.validation";

export type * as types from "../../modules/emotions/value-objects";

export const HomeEntryAddForm = {
  situationDescription: { min: SituationDescriptionMin, max: SituationDescriptionMax },
};
