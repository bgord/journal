import {
  SituationDescriptionMax,
  SituationDescriptionMin,
} from "../../modules/emotions/value-objects/situation-description.validation";

export type * as types from "../../modules/emotions/value-objects";

export const HomeEntryAdd = {
  situationDescription: { min: SituationDescriptionMin, max: SituationDescriptionMax },
};
